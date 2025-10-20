import { blobStream, concatStream } from './streams';

function isDupe(newFile, array) {
  for (const file of array) {
    if (
      newFile.name === file.name &&
      newFile.size === file.size &&
      newFile.lastModified === file.lastModified
    ) {
      return true;
    }
  }
  return false;
}

export default class Archive {
  constructor(files = [], defaultTimeLimit = 86400, defaultDownloadLimit = 1) {
    this.files = Array.from(files);
    this.defaultTimeLimit = defaultTimeLimit;
    this.defaultDownloadLimit = defaultDownloadLimit;
    this.timeLimit = defaultTimeLimit;
    this.dlimit = defaultDownloadLimit;
    this.password = null;
    this.customArchiveName = null;
    this.recipientUserId = null; // ID of user to encrypt for (optional)
    this.recipientPublicKey = null; // X25519 public key of recipient (base64)
  }

  get name() {
    if (this.files.length > 1) {
      // Use custom name if set, otherwise default to 'Send-Archive'
      const baseName = this.customArchiveName || 'Send-Archive';
      // Ensure .zip extension
      return baseName.endsWith('.zip') ? baseName : `${baseName}.zip`;
    }
    return this.files[0].name;
  }

  setArchiveName(name) {
    // Only allow setting custom name for multi-file archives
    if (this.files.length > 1) {
      this.customArchiveName = name;
    }
  }

  get type() {
    return this.files.length > 1 ? 'send-archive' : this.files[0].type;
  }

  get size() {
    return this.files.reduce((total, file) => total + file.size, 0);
  }

  get numFiles() {
    return this.files.length;
  }

  get manifest() {
    return {
      files: this.files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))
    };
  }

  get stream() {
    return concatStream(this.files.map(file => blobStream(file)));
  }

  addFiles(files, maxSize, maxFiles) {
    if (this.files.length + files.length > maxFiles) {
      throw new Error('tooManyFiles');
    }
    const newFiles = files.filter(
      file => file.size > 0 && !isDupe(file, this.files)
    );
    const newSize = newFiles.reduce((total, file) => total + file.size, 0);
    if (this.size + newSize > maxSize) {
      throw new Error('fileTooBig');
    }
    this.files = this.files.concat(newFiles);
    return true;
  }

  remove(file) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }

  clear() {
    this.files = [];
    this.dlimit = this.defaultDownloadLimit;
    this.timeLimit = this.defaultTimeLimit;
    this.password = null;
    this.customArchiveName = null;
    this.recipientUserId = null;
    this.recipientPublicKey = null;
  }

  setRecipient(userId, publicKey) {
    this.recipientUserId = userId;
    this.recipientPublicKey = publicKey;
  }

  clearRecipient() {
    this.recipientUserId = null;
    this.recipientPublicKey = null;
  }
}
