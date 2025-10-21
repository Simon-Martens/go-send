import OwnedFile from "./ownedFile";
import storage from "./storage.mjs";
import UserSecrets, { OWNER_SECRET_VERSION } from "./userSecrets.mjs";
import Keychain from "./keychain";
import { arrayToB64, bytes } from "./utils";
import { uploadWs } from "./api";
import { encryptedSize } from "./utils";

export default class FileSender extends EventTarget {
  constructor() {
    super();
    this.keychain = new Keychain();
    this.reset();
  }

  get progressRatio() {
    return this.progress[0] / this.progress[1];
  }

  get progressIndefinite() {
    return (
      ["fileSizeProgress", "notifyUploadEncryptDone"].indexOf(this.msg) === -1
    );
  }

  get sizes() {
    return {
      partialSize: bytes(this.progress[0]),
      totalSize: bytes(this.progress[1]),
    };
  }

  reset() {
    this.uploadRequest = null;
    this.msg = "importingFile";
    this.progress = [0, 1];
    this.cancelled = false;
  }

  cancel() {
    this.cancelled = true;
    if (this.uploadRequest) {
      this.uploadRequest.cancel();
    }
  }

  async upload(archive) {
    if (this.cancelled) {
      throw new Error(0);
    }
    this.msg = "encryptingFile";
    this.dispatchEvent(new Event("encrypting"));
    const totalSize = encryptedSize(archive.size);
    const encStream = await this.keychain.encryptStream(archive.stream);
    const metadata = await this.keychain.encryptMetadata(archive);
    const authKeyB64 = await this.keychain.authKeyB64();
    let ownerSecretWrap = null;
    let recipientSecretWrap = null;

    const userSecrets = storage.user;
    if (userSecrets) {
      try {
        const wrapResult = await userSecrets.wrapSecret(
          this.keychain.rawSecret,
        );
        ownerSecretWrap = {
          ciphertext: wrapResult.ciphertext,
          nonce: wrapResult.nonce,
          ephemeralPublicKey: wrapResult.ephemeralPublicKey,
          version: wrapResult.version || OWNER_SECRET_VERSION,
        };
        if (wrapResult.updated) {
          storage.setUser(userSecrets);
        }
      } catch (err) {
        console.warn("[FileSender] Failed to wrap owner secret", err);
      }
    }
    // Wrap secret for recipient (if one was selected)
    if (archive.recipientUserId && archive.recipientPublicKey) {
      try {
        const wrapResult = await UserSecrets.wrapSecretForRecipient(
          this.keychain.rawSecret,
          archive.recipientPublicKey,
        );
        recipientSecretWrap = {
          userId: archive.recipientUserId,
          ciphertext: wrapResult.ciphertext,
          nonce: wrapResult.nonce,
          ephemeralPublicKey: wrapResult.ephemeralPublicKey,
          version: wrapResult.version || OWNER_SECRET_VERSION,
        };
      } catch (err) {
        console.warn("[FileSender] Failed to wrap recipient secret", err);
        // Don't fail upload if recipient wrapping fails, just proceed without it
      }
    }

    this.uploadRequest = uploadWs(
      encStream,
      metadata,
      authKeyB64,
      archive.timeLimit,
      archive.dlimit,
      (p) => {
        this.progress = [p, totalSize];
        this.dispatchEvent(new Event("progress"));
      },
      ownerSecretWrap,
      recipientSecretWrap,
    );

    if (this.cancelled) {
      throw new Error(0);
    }

    this.msg = "fileSizeProgress";
    this.dispatchEvent(new Event("progress")); // HACK to kick MS Edge
    try {
      const result = await this.uploadRequest.result;
      this.msg = "notifyUploadEncryptDone";
      this.uploadRequest = null;
      this.progress = [1, 1];
      const secretKey = arrayToB64(this.keychain.rawSecret);

      // Get owner name from logged-in user (if available)
      const ownerString = storage.user && storage.user.name ? storage.user.name : "";

      // Build recipients array (if one was selected)
      const recipients = [];
      if (archive.recipientUserId) {
        recipients.push({
          userId: archive.recipientUserId,
          userName: archive.recipientName || "",
          userEmail: "", // Not available during upload
        });
      }

      const ownedFile = new OwnedFile({
        id: result.id,
        url: `${result.url}#${secretKey}`,
        name: archive.name,
        size: archive.size,
        manifest: archive.manifest,
        time: result.duration,
        speed: archive.size / (result.duration / 1000),
        createdAt: Date.now(),
        expiresAt: Date.now() + archive.timeLimit * 1000,
        secretKey: secretKey,
        nonce: this.keychain.nonce,
        ownerToken: result.ownerToken,
        dlimit: archive.dlimit,
        timeLimit: archive.timeLimit,
        ownerString: ownerString,
        authString: "", // Not used for logged-in user uploads
        recipients: recipients,
      });

      return ownedFile;
    } catch (e) {
      this.msg = "errorPageHeader";
      this.uploadRequest = null;
      throw e;
    }
  }
}
