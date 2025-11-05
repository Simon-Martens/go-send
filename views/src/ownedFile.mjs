import Keychain from "./keychain";
import { arrayToB64 } from "./utils";
import { del, fileInfo, setParams, setPassword, updateFile } from "./api";

export default class OwnedFile {
  constructor(obj) {
    if (!obj.manifest) {
      throw new Error("invalid file object");
    }
    this.id = obj.id;
    this.url = obj.url;
    this.name = obj.name;
    this.size = obj.size;
    this.manifest = obj.manifest;
    this.time = obj.time;
    this.speed = obj.speed;
    this.createdAt = obj.createdAt;
    this.expiresAt = obj.expiresAt;
    this.ownerToken = obj.ownerToken;
    this.dlimit = obj.dlimit || 1;
    this.dtotal = obj.dtotal || 0;
    this.keychain = new Keychain(obj.secretKey, obj.nonce);
    this._hasPassword = !!obj.hasPassword;
    this.timeLimit = obj.timeLimit;
    this.ownerString = obj.ownerString || "";
    this.authString = obj.authString || "";
    this.recipients = obj.recipients || []; // Array of {userId, userName, userEmail}
  }

  get hasPassword() {
    return !!this._hasPassword;
  }

  get expired() {
    return this.dlimit === this.dtotal || Date.now() > this.expiresAt;
  }

  async setPassword(password) {
    try {
      this.password = password;
      this._hasPassword = true;
      this.keychain.setPassword(password, this.url);
      const result = await setPassword(this.id, this.ownerToken, this.keychain);
      return result;
    } catch (e) {
      this.password = null;
      this._hasPassword = false;
      throw e;
    }
  }

  del() {
    return del(this.id, this.ownerToken);
  }

  async changeLimit(dlimit) {
    if (this.dlimit !== dlimit) {
      const result = await updateFile(
        this.id,
        this.ownerToken,
        this.keychain,
        { dlimit, resetDcount: true }
      );
      if (result) {
        this.dlimit = dlimit;
        this.dtotal = 0; // Reset download count locally
        return true;
      }
      return false;
    }
    return true;
  }

  async updateName(newName) {
    const newMetadata = {
      name: newName,
      size: this.size,
      type: this.manifest.files?.[0]?.type || "application/octet-stream",
      manifest: this.manifest,
    };

    const encryptedMetadata = await this.keychain.encryptMetadata(newMetadata);
    const metadataB64 = arrayToB64(new Uint8Array(encryptedMetadata));

    const result = await updateFile(this.id, this.ownerToken, this.keychain, {
      metadata: metadataB64,
    });

    if (result) {
      this.name = newName;
      return true;
    }
    return false;
  }

  async updateExpiry(newExpiresAt) {
    const expiresAtSeconds = Math.floor(newExpiresAt / 1000);
    const result = await updateFile(this.id, this.ownerToken, this.keychain, {
      expiresAt: expiresAtSeconds,
    });

    if (result) {
      this.expiresAt = newExpiresAt;
      return true;
    }
    return false;
  }

  async updateDownloadCount() {
    const oldTotal = this.dtotal;
    const oldLimit = this.dlimit;
    try {
      const result = await fileInfo(this.id, this.ownerToken);
      this.dtotal = result.dtotal;
      this.dlimit = result.dlimit;
    } catch (e) {
      if (e.message === "404") {
        this.dtotal = this.dlimit;
      }
      // ignore other errors
    }
    return oldTotal !== this.dtotal || oldLimit !== this.dlimit;
  }

  toJSON() {
    return {
      id: this.id,
      url: this.url,
      name: this.name,
      size: this.size,
      manifest: this.manifest,
      time: this.time,
      speed: this.speed,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
      secretKey: arrayToB64(this.keychain.rawSecret),
      nonce: this.keychain.nonce,  // CRITICAL: Save nonce for HMAC auth
      ownerToken: this.ownerToken,
      dlimit: this.dlimit,
      dtotal: this.dtotal,
      hasPassword: this.hasPassword,
      timeLimit: this.timeLimit,
      ownerString: this.ownerString,
      authString: this.authString,
      recipients: this.recipients,
    };
  }
}
