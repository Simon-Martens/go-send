import { arrayToB64, isFile } from "./utils";
import OwnedFile from "./ownedFile";
import UserSecrets, { getUserStorageKey } from "./userSecrets.mjs";

class Mem {
  constructor() {
    this.items = new Map();
  }

  get length() {
    return this.items.size;
  }

  getItem(key) {
    return this.items.get(key);
  }

  setItem(key, value) {
    return this.items.set(key, value);
  }

  removeItem(key) {
    return this.items.delete(key);
  }

  key(i) {
    return this.items.keys()[i];
  }
}

class Storage {
  constructor() {
    // The trust preference is always stored in localStorage
    // so it persists across sessions
    this._trustStorage = null;
    try {
      this._trustStorage = localStorage;
    } catch (e) {
      // If localStorage is not available, we can't persist trust preference
    }

    // Determine which storage engine to use based on trust preference
    const trusted = this.getTrustPreference();
    try {
      this.engine = trusted ? localStorage : sessionStorage;
      if (!this.engine) {
        this.engine = new Mem();
      }
    } catch (e) {
      this.engine = new Mem();
    }
    this._files = this.loadFiles();
    this._user = this.loadUser();
  }

  loadFiles() {
    const fs = new Map();
    for (let i = 0; i < this.engine.length; i++) {
      const k = this.engine.key(i);
      if (k === getUserStorageKey()) {
        continue;
      }
      if (isFile(k)) {
        try {
          const f = new OwnedFile(JSON.parse(this.engine.getItem(k)));
          if (!f.id) {
            f.id = f.fileId;
          }

          fs.set(f.id, f);
        } catch (err) {
          // obviously you're not a golfer
          this.engine.removeItem(k);
        }
      }
    }
    return fs;
  }

  loadUser() {
    try {
      const raw = this.engine.getItem(getUserStorageKey());
      if (!raw) {
        return null;
      }
      return new UserSecrets(JSON.parse(raw));
    } catch (err) {
      this.engine.removeItem(getUserStorageKey());
      return null;
    }
  }

  get id() {
    let id = this.engine.getItem("device_id");
    if (!id) {
      id = arrayToB64(crypto.getRandomValues(new Uint8Array(16)));
      this.engine.setItem("device_id", id);
    }
    return id;
  }

  get totalDownloads() {
    return Number(this.engine.getItem("totalDownloads"));
  }
  set totalDownloads(n) {
    this.engine.setItem("totalDownloads", n);
  }
  get totalUploads() {
    return Number(this.engine.getItem("totalUploads"));
  }
  set totalUploads(n) {
    this.engine.setItem("totalUploads", n);
  }
  get referrer() {
    return this.engine.getItem("referrer");
  }
  set referrer(str) {
    this.engine.setItem("referrer", str);
  }
  get enrolled() {
    return JSON.parse(this.engine.getItem("ab_experiments") || "{}");
  }

  enroll(id, variant) {
    const enrolled = {};
    enrolled[id] = variant;
    this.engine.setItem("ab_experiments", JSON.stringify(enrolled));
  }

  get files() {
    return Array.from(this._files.values()).sort(
      (a, b) => a.createdAt - b.createdAt,
    );
  }

  getFileById(id) {
    return this._files.get(id);
  }

  get user() {
    return this._user;
  }

  get(id) {
    return this.engine.getItem(id);
  }

  set(id, value) {
    return this.engine.setItem(id, value);
  }

  remove(property) {
    if (isFile(property)) {
      this._files.delete(property);
    }
    this.engine.removeItem(property);
  }

  addFile(file) {
    this._files.set(file.id, file);
    this.writeFile(file);
  }

  writeFile(file) {
    this.engine.setItem(file.id, JSON.stringify(file));
  }

  setUser(user) {
    if (!(user instanceof UserSecrets)) {
      throw new Error("Expected UserSecrets instance");
    }
    this._user = user;
    this.engine.setItem(
      getUserStorageKey(),
      JSON.stringify(user.toJSON()),
    );
  }

  clearUser() {
    this._user = null;
    this.engine.removeItem(getUserStorageKey());
  }

  writeFiles() {
    this._files.forEach((f) => this.writeFile(f));
  }

  clearLocalFiles() {
    this._files.forEach((f) => this.engine.removeItem(f.id));
    this._files = new Map();
  }

  clearAll() {
    this._files = new Map();
    this._user = null;
    if (this.engine.clear) {
      this.engine.clear();
    } else {
      // Fallback for Mem storage
      const keys = [];
      for (let i = 0; i < this.engine.length; i++) {
        keys.push(this.engine.key(i));
      }
      keys.forEach(k => this.engine.removeItem(k));
    }
  }

  async merge(files = []) {
    let incoming = false;
    let outgoing = false;
    let downloadCount = false;
    for (const f of files) {
      if (!this.getFileById(f.id)) {
        this.addFile(new OwnedFile(f));
        incoming = true;
      }
    }
    const workingFiles = this.files.slice();
    for (const f of workingFiles) {
      const cc = await f.updateDownloadCount();
      if (cc) {
        await this.writeFile(f);
      }
      downloadCount = downloadCount || cc;
      outgoing = outgoing || f.expired;
      if (f.expired) {
        this.remove(f.id);
      } else if (!files.find((x) => x.id === f.id)) {
        outgoing = true;
      }
    }
    return {
      incoming,
      outgoing,
      downloadCount,
    };
  }

  getTrustPreference() {
    // Trust preference is always stored in localStorage (if available)
    // so it persists even when using sessionStorage for data
    if (!this._trustStorage) {
      return false; // Default to not trusted if localStorage unavailable
    }
    try {
      const pref = this._trustStorage.getItem("trust_this_computer");
      // Default to true for backwards compatibility (existing users)
      return pref === null ? true : pref === "true";
    } catch (e) {
      return false;
    }
  }

  setTrustPreference(trusted) {
    if (!this._trustStorage) {
      return; // Can't persist preference without localStorage
    }
    try {
      this._trustStorage.setItem("trust_this_computer", trusted ? "true" : "false");
    } catch (e) {
      console.warn("[Storage] Failed to persist trust preference", e);
    }
  }

  switchStorageEngine(trusted) {
    // Save the preference
    this.setTrustPreference(trusted);

    // Determine new storage engine
    let newEngine;
    try {
      newEngine = trusted ? localStorage : sessionStorage;
      if (!newEngine) {
        console.warn("[Storage] Requested storage engine unavailable");
        return;
      }
    } catch (e) {
      console.warn("[Storage] Failed to access storage engine", e);
      return;
    }

    // If switching from localStorage to sessionStorage, copy data
    if (!trusted && this.engine === localStorage) {
      try {
        // Copy all items from localStorage to sessionStorage
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key === "trust_this_computer") {
            continue; // Don't copy the trust preference itself
          }
          const value = localStorage.getItem(key);
          sessionStorage.setItem(key, value);
        }
      } catch (e) {
        console.warn("[Storage] Failed to migrate data to sessionStorage", e);
      }
    }

    // If switching from sessionStorage to localStorage, copy data
    if (trusted && this.engine === sessionStorage) {
      try {
        // Copy all items from sessionStorage to localStorage
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          const value = sessionStorage.getItem(key);
          localStorage.setItem(key, value);
        }
      } catch (e) {
        console.warn("[Storage] Failed to migrate data to localStorage", e);
      }
    }

    // Switch engine
    this.engine = newEngine;

    // Reload data from new engine
    this._files = this.loadFiles();
    this._user = this.loadUser();
  }
}

export default new Storage();
