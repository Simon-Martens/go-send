import {
  syncOwnedFiles
} from "./chunks/chunk-ATYDBTFA.js";
import {
  tooltip
} from "./chunks/chunk-5GRZTTPD.js";
import {
  APP_VERSION,
  Keychain,
  OWNER_SECRET_VERSION,
  OwnedFile,
  USER_ROLES,
  UserSecrets,
  storage_default
} from "./chunks/chunk-3WTCPM2E.js";
import {
  blobStream,
  concatStream,
  downloadFile,
  getApiUrl,
  metadata,
  uploadWs
} from "./chunks/chunk-WXWAAH3Q.js";
import {
  arrayToB64,
  browserName,
  bytes,
  copyToClipboard,
  delay,
  encryptedSize,
  getGuestLabel,
  hasGuestToken,
  locale,
  openLinksInNewTab,
  setTranslate,
  streamToArrayBuffer,
  translateElement
} from "./chunks/chunk-TXB3JAVG.js";
import "./chunks/chunk-IFG75HHC.js";

// node_modules/crc/mjs/calculators/crc32.js
var TABLE = [
  0,
  1996959894,
  3993919788,
  2567524794,
  124634137,
  1886057615,
  3915621685,
  2657392035,
  249268274,
  2044508324,
  3772115230,
  2547177864,
  162941995,
  2125561021,
  3887607047,
  2428444049,
  498536548,
  1789927666,
  4089016648,
  2227061214,
  450548861,
  1843258603,
  4107580753,
  2211677639,
  325883990,
  1684777152,
  4251122042,
  2321926636,
  335633487,
  1661365465,
  4195302755,
  2366115317,
  997073096,
  1281953886,
  3579855332,
  2724688242,
  1006888145,
  1258607687,
  3524101629,
  2768942443,
  901097722,
  1119000684,
  3686517206,
  2898065728,
  853044451,
  1172266101,
  3705015759,
  2882616665,
  651767980,
  1373503546,
  3369554304,
  3218104598,
  565507253,
  1454621731,
  3485111705,
  3099436303,
  671266974,
  1594198024,
  3322730930,
  2970347812,
  795835527,
  1483230225,
  3244367275,
  3060149565,
  1994146192,
  31158534,
  2563907772,
  4023717930,
  1907459465,
  112637215,
  2680153253,
  3904427059,
  2013776290,
  251722036,
  2517215374,
  3775830040,
  2137656763,
  141376813,
  2439277719,
  3865271297,
  1802195444,
  476864866,
  2238001368,
  4066508878,
  1812370925,
  453092731,
  2181625025,
  4111451223,
  1706088902,
  314042704,
  2344532202,
  4240017532,
  1658658271,
  366619977,
  2362670323,
  4224994405,
  1303535960,
  984961486,
  2747007092,
  3569037538,
  1256170817,
  1037604311,
  2765210733,
  3554079995,
  1131014506,
  879679996,
  2909243462,
  3663771856,
  1141124467,
  855842277,
  2852801631,
  3708648649,
  1342533948,
  654459306,
  3188396048,
  3373015174,
  1466479909,
  544179635,
  3110523913,
  3462522015,
  1591671054,
  702138776,
  2966460450,
  3352799412,
  1504918807,
  783551873,
  3082640443,
  3233442989,
  3988292384,
  2596254646,
  62317068,
  1957810842,
  3939845945,
  2647816111,
  81470997,
  1943803523,
  3814918930,
  2489596804,
  225274430,
  2053790376,
  3826175755,
  2466906013,
  167816743,
  2097651377,
  4027552580,
  2265490386,
  503444072,
  1762050814,
  4150417245,
  2154129355,
  426522225,
  1852507879,
  4275313526,
  2312317920,
  282753626,
  1742555852,
  4189708143,
  2394877945,
  397917763,
  1622183637,
  3604390888,
  2714866558,
  953729732,
  1340076626,
  3518719985,
  2797360999,
  1068828381,
  1219638859,
  3624741850,
  2936675148,
  906185462,
  1090812512,
  3747672003,
  2825379669,
  829329135,
  1181335161,
  3412177804,
  3160834842,
  628085408,
  1382605366,
  3423369109,
  3138078467,
  570562233,
  1426400815,
  3317316542,
  2998733608,
  733239954,
  1555261956,
  3268935591,
  3050360625,
  752459403,
  1541320221,
  2607071920,
  3965973030,
  1969922972,
  40735498,
  2617837225,
  3943577151,
  1913087877,
  83908371,
  2512341634,
  3803740692,
  2075208622,
  213261112,
  2463272603,
  3855990285,
  2094854071,
  198958881,
  2262029012,
  4057260610,
  1759359992,
  534414190,
  2176718541,
  4139329115,
  1873836001,
  414664567,
  2282248934,
  4279200368,
  1711684554,
  285281116,
  2405801727,
  4167216745,
  1634467795,
  376229701,
  2685067896,
  3608007406,
  1308918612,
  956543938,
  2808555105,
  3495958263,
  1231636301,
  1047427035,
  2932959818,
  3654703836,
  1088359270,
  936918e3,
  2847714899,
  3736837829,
  1202900863,
  817233897,
  3183342108,
  3401237130,
  1404277552,
  615818150,
  3134207493,
  3453421203,
  1423857449,
  601450431,
  3009837614,
  3294710456,
  1567103746,
  711928724,
  3020668471,
  3272380065,
  1510334235,
  755167117
];
if (typeof Int32Array !== "undefined") {
  TABLE = new Int32Array(TABLE);
}
var crc32 = (current, previous) => {
  let crc = previous === 0 ? 0 : ~~previous ^ -1;
  for (let index = 0; index < current.length; index++) {
    crc = TABLE[(crc ^ current[index]) & 255] ^ crc >>> 8;
  }
  return crc ^ -1;
};
var crc32_default = crc32;

// src/zip.mjs
var encoder = new TextEncoder();
function dosDateTime(dateTime = /* @__PURE__ */ new Date()) {
  const year = dateTime.getFullYear() - 1980 << 9;
  const month = dateTime.getMonth() + 1 << 5;
  const day = dateTime.getDate();
  const date = year | month | day;
  const hour = dateTime.getHours() << 11;
  const minute = dateTime.getMinutes() << 5;
  const second = Math.floor(dateTime.getSeconds() / 2);
  const time = hour | minute | second;
  return { date, time };
}
var File = class {
  constructor(info) {
    this.name = encoder.encode(info.name);
    this.size = info.size;
    this.bytesRead = 0;
    this.crc = null;
    this.dateTime = dosDateTime();
  }
  get header() {
    const h = new ArrayBuffer(30 + this.name.byteLength);
    const v = new DataView(h);
    v.setUint32(0, 67324752, true);
    v.setUint16(4, 20, true);
    v.setUint16(6, 2056, true);
    v.setUint16(8, 0, true);
    v.setUint16(10, this.dateTime.time, true);
    v.setUint16(12, this.dateTime.date, true);
    v.setUint32(14, 0, true);
    v.setUint32(18, 0, true);
    v.setUint32(22, 0, true);
    v.setUint16(26, this.name.byteLength, true);
    v.setUint16(28, 0, true);
    for (let i = 0; i < this.name.byteLength; i++) {
      v.setUint8(30 + i, this.name[i]);
    }
    return new Uint8Array(h);
  }
  get dataDescriptor() {
    const dd = new ArrayBuffer(16);
    const v = new DataView(dd);
    v.setUint32(0, 134695760, true);
    v.setUint32(4, this.crc, true);
    v.setUint32(8, this.size, true);
    v.setUint32(12, this.size, true);
    return new Uint8Array(dd);
  }
  directoryRecord(offset) {
    const dr = new ArrayBuffer(46 + this.name.byteLength);
    const v = new DataView(dr);
    v.setUint32(0, 33639248, true);
    v.setUint16(4, 20, true);
    v.setUint16(6, 20, true);
    v.setUint16(8, 2056, true);
    v.setUint16(10, 0, true);
    v.setUint16(12, this.dateTime.time, true);
    v.setUint16(14, this.dateTime.date, true);
    v.setUint32(16, this.crc, true);
    v.setUint32(20, this.size, true);
    v.setUint32(24, this.size, true);
    v.setUint16(28, this.name.byteLength, true);
    v.setUint16(30, 0, true);
    v.setUint16(32, 0, true);
    v.setUint16(34, 0, true);
    v.setUint16(36, 0, true);
    v.setUint32(38, 0, true);
    v.setUint32(42, offset, true);
    for (let i = 0; i < this.name.byteLength; i++) {
      v.setUint8(46 + i, this.name[i]);
    }
    return new Uint8Array(dr);
  }
  get byteLength() {
    return this.size + this.name.byteLength + 30 + 16;
  }
  append(data, controller) {
    this.bytesRead += data.byteLength;
    const endIndex = data.byteLength - Math.max(this.bytesRead - this.size, 0);
    const buf = data.slice(0, endIndex);
    this.crc = crc32_default(buf, this.crc);
    controller.enqueue(buf);
    if (endIndex < data.byteLength) {
      return data.slice(endIndex, data.byteLength);
    }
  }
};
function centralDirectory(files, controller) {
  let directoryOffset = 0;
  let directorySize = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const record = file.directoryRecord(directoryOffset);
    directoryOffset += file.byteLength;
    controller.enqueue(record);
    directorySize += record.byteLength;
  }
  controller.enqueue(eod(files.length, directorySize, directoryOffset));
}
function eod(fileCount, directorySize, directoryOffset) {
  const e = new ArrayBuffer(22);
  const v = new DataView(e);
  v.setUint32(0, 101010256, true);
  v.setUint16(4, 0, true);
  v.setUint16(6, 0, true);
  v.setUint16(8, fileCount, true);
  v.setUint16(10, fileCount, true);
  v.setUint32(12, directorySize, true);
  v.setUint32(16, directoryOffset, true);
  v.setUint16(20, 0, true);
  return new Uint8Array(e);
}
var ZipStreamController = class {
  constructor(files, source) {
    this.files = files;
    this.fileIndex = 0;
    this.file = null;
    this.reader = source.getReader();
    this.nextFile();
    this.extra = null;
  }
  nextFile() {
    this.file = this.files[this.fileIndex++];
  }
  async pull(controller) {
    if (!this.file) {
      centralDirectory(this.files, controller);
      return controller.close();
    }
    if (this.file.bytesRead === 0) {
      controller.enqueue(this.file.header);
      if (this.extra) {
        this.extra = this.file.append(this.extra, controller);
      }
    }
    if (this.file.bytesRead >= this.file.size) {
      controller.enqueue(this.file.dataDescriptor);
      this.nextFile();
      return this.pull(controller);
    }
    const data = await this.reader.read();
    if (data.done) {
      this.nextFile();
      return this.pull(controller);
    }
    this.extra = this.file.append(data.value, controller);
  }
};
var Zip = class {
  constructor(manifest, source) {
    this.files = manifest.files.map((info) => new File(info));
    this.source = source;
  }
  get stream() {
    return new ReadableStream(new ZipStreamController(this.files, this.source));
  }
  get size() {
    const entries = this.files.reduce(
      (total, file) => total + file.byteLength * 2 - file.size,
      0
    );
    const eod2 = 22;
    return entries + eod2;
  }
};

// src/fileReceiver.mjs
var FileReceiver = class extends EventTarget {
  constructor(fileInfo) {
    super();
    this.keychain = new Keychain(fileInfo.secretKey, fileInfo.nonce);
    if (fileInfo.requiresPassword) {
      this.keychain.setPassword(fileInfo.password, fileInfo.url);
    }
    this.fileInfo = fileInfo;
    this.reset();
  }
  get progressRatio() {
    return this.progress[0] / this.progress[1];
  }
  get progressIndefinite() {
    return this.state !== "downloading";
  }
  get sizes() {
    return {
      partialSize: bytes(this.progress[0]),
      totalSize: bytes(this.progress[1])
    };
  }
  cancel() {
    if (this.downloadRequest) {
      this.downloadRequest.cancel();
    }
  }
  reset() {
    this.msg = "fileSizeProgress";
    this.state = "initialized";
    this.progress = [0, 1];
  }
  async getMetadata() {
    const meta = await metadata(this.fileInfo.id, this.keychain);
    this.fileInfo.name = meta.name;
    this.fileInfo.type = meta.type;
    this.fileInfo.iv = meta.iv;
    this.fileInfo.size = +meta.size;
    this.fileInfo.manifest = meta.manifest;
    this.state = "ready";
  }
  // Removed: reportLink feature not implemented in Go backend
  // async reportLink(reason) {
  //   await reportLink(this.fileInfo.id, this.keychain, reason);
  // }
  sendMessageToSw(msg) {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = function(event) {
        if (event.data === void 0) {
          reject("bad response from serviceWorker");
        } else if (event.data.error !== void 0) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };
      navigator.serviceWorker.controller.postMessage(msg, [channel.port2]);
    });
  }
  async downloadBlob(noSave = false) {
    this.state = "downloading";
    this.downloadRequest = await downloadFile(
      this.fileInfo.id,
      this.keychain,
      (p) => {
        this.progress = [p, this.fileInfo.size];
        this.dispatchEvent(new Event("progress"));
      }
    );
    try {
      const ciphertext = await this.downloadRequest.result;
      this.downloadRequest = null;
      this.msg = "decryptingFile";
      this.state = "decrypting";
      this.dispatchEvent(new Event("decrypting"));
      let size = this.fileInfo.size;
      let plainStream = this.keychain.decryptStream(blobStream(ciphertext));
      if (this.fileInfo.type === "send-archive") {
        const zip = new Zip(this.fileInfo.manifest, plainStream);
        plainStream = zip.stream;
        size = zip.size;
      }
      const plaintext = await streamToArrayBuffer(plainStream, size);
      if (!noSave) {
        await saveFile({
          plaintext,
          name: decodeURIComponent(this.fileInfo.name),
          type: this.fileInfo.type
        });
      }
      this.msg = "downloadFinish";
      this.dispatchEvent(new Event("complete"));
      this.state = "complete";
    } catch (e) {
      this.downloadRequest = null;
      throw e;
    }
  }
  async downloadStream(noSave = false) {
    if (!navigator.serviceWorker.controller) {
      console.log("Service worker NA, switching to legacy download");
      return this.downloadBlob(noSave);
    }
    const start2 = Date.now();
    const onprogress = (p) => {
      this.progress = [p, this.fileInfo.size];
      this.dispatchEvent(new Event("progress"));
    };
    this.downloadRequest = {
      cancel: () => {
        this.sendMessageToSw({ request: "cancel", id: this.fileInfo.id });
      }
    };
    try {
      this.state = "downloading";
      const info = {
        request: "init",
        id: this.fileInfo.id,
        filename: this.fileInfo.name,
        type: this.fileInfo.type,
        manifest: this.fileInfo.manifest,
        key: this.fileInfo.secretKey,
        requiresPassword: this.fileInfo.requiresPassword,
        password: this.fileInfo.password,
        url: this.fileInfo.url,
        size: this.fileInfo.size,
        nonce: this.keychain.nonce,
        noSave
      };
      await this.sendMessageToSw(info);
      onprogress(0);
      if (noSave) {
        const res = await fetch(getApiUrl(`/api/download/${this.fileInfo.id}`));
        if (res.status !== 200) {
          throw new Error(res.status);
        }
      } else {
        const downloadPath = `/api/download/${this.fileInfo.id}`;
        let downloadUrl = getApiUrl(downloadPath);
        if (downloadUrl === downloadPath) {
          downloadUrl = `${location.protocol}//${location.host}${downloadPath}`;
        }
        const a = document.createElement("a");
        a.href = downloadUrl;
        document.body.appendChild(a);
        a.click();
      }
      let prog = 0;
      let hangs = 0;
      while (prog < this.fileInfo.size) {
        const msg = await this.sendMessageToSw({
          request: "progress",
          id: this.fileInfo.id
        });
        if (msg.progress === prog) {
          hangs++;
        } else {
          hangs = 0;
        }
        if (hangs > 30) {
          const e = new Error("hung download");
          e.duration = Date.now() - start2;
          e.size = this.fileInfo.size;
          e.progress = prog;
          throw e;
        }
        prog = msg.progress;
        onprogress(prog);
        await delay(1e3);
      }
      this.downloadRequest = null;
      this.msg = "downloadFinish";
      this.dispatchEvent(new Event("complete"));
      this.state = "complete";
    } catch (e) {
      this.downloadRequest = null;
      if (e === "cancelled" || e.message === "400") {
        throw new Error(0);
      }
      throw e;
    }
  }
  download(options) {
    if (options.stream) {
      return this.downloadStream(options.noSave);
    }
    return this.downloadBlob(options.noSave);
  }
};
async function saveFile(file) {
  return new Promise(function(resolve, reject) {
    const dataView = new DataView(file.plaintext);
    const blob = new Blob([dataView], { type: file.type });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, file.name);
      return resolve();
    } else {
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(downloadUrl);
      setTimeout(resolve, 100);
    }
  });
}

// src/fileSender.mjs
var FileSender = class extends EventTarget {
  constructor() {
    super();
    this.keychain = new Keychain();
    this.reset();
  }
  get progressRatio() {
    return this.progress[0] / this.progress[1];
  }
  get progressIndefinite() {
    return ["fileSizeProgress", "notifyUploadEncryptDone"].indexOf(this.msg) === -1;
  }
  get sizes() {
    return {
      partialSize: bytes(this.progress[0]),
      totalSize: bytes(this.progress[1])
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
    const metadata2 = await this.keychain.encryptMetadata(archive);
    const authKeyB64 = await this.keychain.authKeyB64();
    let ownerSecretWrap = null;
    let recipientSecretWrap = null;
    const userSecrets = storage_default.user;
    if (userSecrets) {
      try {
        const wrapResult = await userSecrets.wrapSecret(
          this.keychain.rawSecret
        );
        ownerSecretWrap = {
          ciphertext: wrapResult.ciphertext,
          nonce: wrapResult.nonce,
          ephemeralPublicKey: wrapResult.ephemeralPublicKey,
          version: wrapResult.version || OWNER_SECRET_VERSION
        };
        if (wrapResult.updated) {
          storage_default.setUser(userSecrets);
        }
      } catch (err) {
        console.warn("[FileSender] Failed to wrap owner secret", err);
      }
    }
    if (archive.recipientUserId && archive.recipientPublicKey) {
      try {
        const wrapResult = await UserSecrets.wrapSecretForRecipient(
          this.keychain.rawSecret,
          archive.recipientPublicKey
        );
        recipientSecretWrap = {
          userId: archive.recipientUserId,
          ciphertext: wrapResult.ciphertext,
          nonce: wrapResult.nonce,
          ephemeralPublicKey: wrapResult.ephemeralPublicKey,
          version: wrapResult.version || OWNER_SECRET_VERSION
        };
      } catch (err) {
        console.warn("[FileSender] Failed to wrap recipient secret", err);
      }
    }
    this.uploadRequest = uploadWs(
      encStream,
      metadata2,
      authKeyB64,
      archive.timeLimit,
      archive.dlimit,
      (p) => {
        this.progress = [p, totalSize];
        this.dispatchEvent(new Event("progress"));
      },
      ownerSecretWrap,
      recipientSecretWrap
    );
    if (this.cancelled) {
      throw new Error(0);
    }
    this.msg = "fileSizeProgress";
    this.dispatchEvent(new Event("progress"));
    try {
      const result = await this.uploadRequest.result;
      this.msg = "notifyUploadEncryptDone";
      this.uploadRequest = null;
      this.progress = [1, 1];
      const secretKey = arrayToB64(this.keychain.rawSecret);
      const ownerString = storage_default.user && storage_default.user.name ? storage_default.user.name : "";
      const recipients = [];
      if (archive.recipientUserId) {
        recipients.push({
          userId: archive.recipientUserId,
          userName: archive.recipientName || "",
          userEmail: ""
          // Not available during upload
        });
      }
      const ownedFile = new OwnedFile({
        id: result.id,
        url: `${result.url}#${secretKey}`,
        name: archive.name,
        size: archive.size,
        manifest: archive.manifest,
        time: result.duration,
        speed: archive.size / (result.duration / 1e3),
        createdAt: Date.now(),
        expiresAt: Date.now() + archive.timeLimit * 1e3,
        secretKey,
        nonce: this.keychain.nonce,
        ownerToken: result.ownerToken,
        dlimit: archive.dlimit,
        timeLimit: archive.timeLimit,
        ownerString,
        authString: "",
        // Not used for logged-in user uploads
        recipients
      });
      return ownedFile;
    } catch (e) {
      this.msg = "errorPageHeader";
      this.uploadRequest = null;
      throw e;
    }
  }
};

// src/capabilities.mjs
async function checkCrypto() {
  try {
    const key = await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 128
      },
      true,
      ["encrypt", "decrypt"]
    );
    await crypto.subtle.exportKey("raw", key);
    await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: crypto.getRandomValues(new Uint8Array(12)),
        tagLength: 128
      },
      key,
      new ArrayBuffer(8)
    );
    await crypto.subtle.importKey(
      "raw",
      crypto.getRandomValues(new Uint8Array(16)),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    await crypto.subtle.importKey(
      "raw",
      crypto.getRandomValues(new Uint8Array(16)),
      "HKDF",
      false,
      ["deriveKey"]
    );
    await crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256"
      },
      true,
      ["deriveBits"]
    );
    return true;
  } catch (err) {
    return false;
  }
}
function checkStreams() {
  try {
    new ReadableStream({
      pull() {
      }
    });
    return true;
  } catch (e) {
    return false;
  }
}
async function getCapabilities() {
  const browser = browserName();
  const isMobile = /mobi|android/i.test(navigator.userAgent);
  const serviceWorker = "serviceWorker" in navigator && browser !== "edge";
  let crypto2 = await checkCrypto();
  const streams = checkStreams();
  const share = isMobile && typeof navigator.share === "function" && locale().startsWith("en");
  const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const mobileFirefox = browser === "firefox" && isMobile;
  return {
    crypto: crypto2,
    serviceWorker,
    streamUpload: streams,
    streamDownload: streams && serviceWorker && browser !== "safari" && !mobileFirefox,
    multifile: streams,
    share,
    standalone
  };
}

// node_modules/@fluent/bundle/esm/types.js
var FluentType = class {
  /**
   * Create a `FluentType` instance.
   *
   * @param value The JavaScript value to wrap.
   */
  constructor(value) {
    this.value = value;
  }
  /**
   * Unwrap the raw value stored by this `FluentType`.
   */
  valueOf() {
    return this.value;
  }
};
var FluentNone = class extends FluentType {
  /**
   * Create an instance of `FluentNone` with an optional fallback value.
   * @param value The fallback value of this `FluentNone`.
   */
  constructor(value = "???") {
    super(value);
  }
  /**
   * Format this `FluentNone` to the fallback string.
   */
  toString(scope) {
    return `{${this.value}}`;
  }
};
var FluentNumber = class extends FluentType {
  /**
   * Create an instance of `FluentNumber` with options to the
   * `Intl.NumberFormat` constructor.
   *
   * @param value The number value of this `FluentNumber`.
   * @param opts Options which will be passed to `Intl.NumberFormat`.
   */
  constructor(value, opts = {}) {
    super(value);
    this.opts = opts;
  }
  /**
   * Format this `FluentNumber` to a string.
   */
  toString(scope) {
    try {
      const nf = scope.memoizeIntlObject(Intl.NumberFormat, this.opts);
      return nf.format(this.value);
    } catch (err) {
      scope.reportError(err);
      return this.value.toString(10);
    }
  }
};
var FluentDateTime = class extends FluentType {
  /**
   * Create an instance of `FluentDateTime` with options to the
   * `Intl.DateTimeFormat` constructor.
   *
   * @param value The number value of this `FluentDateTime`, in milliseconds.
   * @param opts Options which will be passed to `Intl.DateTimeFormat`.
   */
  constructor(value, opts = {}) {
    super(value);
    this.opts = opts;
  }
  /**
   * Format this `FluentDateTime` to a string.
   */
  toString(scope) {
    try {
      const dtf = scope.memoizeIntlObject(Intl.DateTimeFormat, this.opts);
      return dtf.format(this.value);
    } catch (err) {
      scope.reportError(err);
      return new Date(this.value).toISOString();
    }
  }
};

// node_modules/@fluent/bundle/esm/resolver.js
var MAX_PLACEABLES = 100;
var FSI = "\u2068";
var PDI = "\u2069";
function match(scope, selector, key) {
  if (key === selector) {
    return true;
  }
  if (key instanceof FluentNumber && selector instanceof FluentNumber && key.value === selector.value) {
    return true;
  }
  if (selector instanceof FluentNumber && typeof key === "string") {
    let category = scope.memoizeIntlObject(Intl.PluralRules, selector.opts).select(selector.value);
    if (key === category) {
      return true;
    }
  }
  return false;
}
function getDefault(scope, variants, star) {
  if (variants[star]) {
    return resolvePattern(scope, variants[star].value);
  }
  scope.reportError(new RangeError("No default"));
  return new FluentNone();
}
function getArguments(scope, args) {
  const positional = [];
  const named = /* @__PURE__ */ Object.create(null);
  for (const arg of args) {
    if (arg.type === "narg") {
      named[arg.name] = resolveExpression(scope, arg.value);
    } else {
      positional.push(resolveExpression(scope, arg));
    }
  }
  return { positional, named };
}
function resolveExpression(scope, expr) {
  switch (expr.type) {
    case "str":
      return expr.value;
    case "num":
      return new FluentNumber(expr.value, {
        minimumFractionDigits: expr.precision
      });
    case "var":
      return resolveVariableReference(scope, expr);
    case "mesg":
      return resolveMessageReference(scope, expr);
    case "term":
      return resolveTermReference(scope, expr);
    case "func":
      return resolveFunctionReference(scope, expr);
    case "select":
      return resolveSelectExpression(scope, expr);
    default:
      return new FluentNone();
  }
}
function resolveVariableReference(scope, { name }) {
  let arg;
  if (scope.params) {
    if (Object.prototype.hasOwnProperty.call(scope.params, name)) {
      arg = scope.params[name];
    } else {
      return new FluentNone(`$${name}`);
    }
  } else if (scope.args && Object.prototype.hasOwnProperty.call(scope.args, name)) {
    arg = scope.args[name];
  } else {
    scope.reportError(new ReferenceError(`Unknown variable: $${name}`));
    return new FluentNone(`$${name}`);
  }
  if (arg instanceof FluentType) {
    return arg;
  }
  switch (typeof arg) {
    case "string":
      return arg;
    case "number":
      return new FluentNumber(arg);
    case "object":
      if (arg instanceof Date) {
        return new FluentDateTime(arg.getTime());
      }
    // eslint-disable-next-line no-fallthrough
    default:
      scope.reportError(new TypeError(`Variable type not supported: $${name}, ${typeof arg}`));
      return new FluentNone(`$${name}`);
  }
}
function resolveMessageReference(scope, { name, attr }) {
  const message = scope.bundle._messages.get(name);
  if (!message) {
    scope.reportError(new ReferenceError(`Unknown message: ${name}`));
    return new FluentNone(name);
  }
  if (attr) {
    const attribute = message.attributes[attr];
    if (attribute) {
      return resolvePattern(scope, attribute);
    }
    scope.reportError(new ReferenceError(`Unknown attribute: ${attr}`));
    return new FluentNone(`${name}.${attr}`);
  }
  if (message.value) {
    return resolvePattern(scope, message.value);
  }
  scope.reportError(new ReferenceError(`No value: ${name}`));
  return new FluentNone(name);
}
function resolveTermReference(scope, { name, attr, args }) {
  const id = `-${name}`;
  const term = scope.bundle._terms.get(id);
  if (!term) {
    scope.reportError(new ReferenceError(`Unknown term: ${id}`));
    return new FluentNone(id);
  }
  if (attr) {
    const attribute = term.attributes[attr];
    if (attribute) {
      scope.params = getArguments(scope, args).named;
      const resolved2 = resolvePattern(scope, attribute);
      scope.params = null;
      return resolved2;
    }
    scope.reportError(new ReferenceError(`Unknown attribute: ${attr}`));
    return new FluentNone(`${id}.${attr}`);
  }
  scope.params = getArguments(scope, args).named;
  const resolved = resolvePattern(scope, term.value);
  scope.params = null;
  return resolved;
}
function resolveFunctionReference(scope, { name, args }) {
  let func = scope.bundle._functions[name];
  if (!func) {
    scope.reportError(new ReferenceError(`Unknown function: ${name}()`));
    return new FluentNone(`${name}()`);
  }
  if (typeof func !== "function") {
    scope.reportError(new TypeError(`Function ${name}() is not callable`));
    return new FluentNone(`${name}()`);
  }
  try {
    let resolved = getArguments(scope, args);
    return func(resolved.positional, resolved.named);
  } catch (err) {
    scope.reportError(err);
    return new FluentNone(`${name}()`);
  }
}
function resolveSelectExpression(scope, { selector, variants, star }) {
  let sel = resolveExpression(scope, selector);
  if (sel instanceof FluentNone) {
    return getDefault(scope, variants, star);
  }
  for (const variant of variants) {
    const key = resolveExpression(scope, variant.key);
    if (match(scope, sel, key)) {
      return resolvePattern(scope, variant.value);
    }
  }
  return getDefault(scope, variants, star);
}
function resolveComplexPattern(scope, ptn) {
  if (scope.dirty.has(ptn)) {
    scope.reportError(new RangeError("Cyclic reference"));
    return new FluentNone();
  }
  scope.dirty.add(ptn);
  const result = [];
  const useIsolating = scope.bundle._useIsolating && ptn.length > 1;
  for (const elem of ptn) {
    if (typeof elem === "string") {
      result.push(scope.bundle._transform(elem));
      continue;
    }
    scope.placeables++;
    if (scope.placeables > MAX_PLACEABLES) {
      scope.dirty.delete(ptn);
      throw new RangeError(`Too many placeables expanded: ${scope.placeables}, max allowed is ${MAX_PLACEABLES}`);
    }
    if (useIsolating) {
      result.push(FSI);
    }
    result.push(resolveExpression(scope, elem).toString(scope));
    if (useIsolating) {
      result.push(PDI);
    }
  }
  scope.dirty.delete(ptn);
  return result.join("");
}
function resolvePattern(scope, value) {
  if (typeof value === "string") {
    return scope.bundle._transform(value);
  }
  return resolveComplexPattern(scope, value);
}

// node_modules/@fluent/bundle/esm/scope.js
var Scope = class {
  constructor(bundle, errors, args) {
    this.dirty = /* @__PURE__ */ new WeakSet();
    this.params = null;
    this.placeables = 0;
    this.bundle = bundle;
    this.errors = errors;
    this.args = args;
  }
  reportError(error) {
    if (!this.errors || !(error instanceof Error)) {
      throw error;
    }
    this.errors.push(error);
  }
  memoizeIntlObject(ctor, opts) {
    let cache2 = this.bundle._intls.get(ctor);
    if (!cache2) {
      cache2 = {};
      this.bundle._intls.set(ctor, cache2);
    }
    let id = JSON.stringify(opts);
    if (!cache2[id]) {
      cache2[id] = new ctor(this.bundle.locales, opts);
    }
    return cache2[id];
  }
};

// node_modules/@fluent/bundle/esm/builtins.js
function values(opts, allowed) {
  const unwrapped = /* @__PURE__ */ Object.create(null);
  for (const [name, opt] of Object.entries(opts)) {
    if (allowed.includes(name)) {
      unwrapped[name] = opt.valueOf();
    }
  }
  return unwrapped;
}
var NUMBER_ALLOWED = [
  "unitDisplay",
  "currencyDisplay",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits"
];
function NUMBER(args, opts) {
  let arg = args[0];
  if (arg instanceof FluentNone) {
    return new FluentNone(`NUMBER(${arg.valueOf()})`);
  }
  if (arg instanceof FluentNumber) {
    return new FluentNumber(arg.valueOf(), {
      ...arg.opts,
      ...values(opts, NUMBER_ALLOWED)
    });
  }
  if (arg instanceof FluentDateTime) {
    return new FluentNumber(arg.valueOf(), {
      ...values(opts, NUMBER_ALLOWED)
    });
  }
  throw new TypeError("Invalid argument to NUMBER");
}
var DATETIME_ALLOWED = [
  "dateStyle",
  "timeStyle",
  "fractionalSecondDigits",
  "dayPeriod",
  "hour12",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName"
];
function DATETIME(args, opts) {
  let arg = args[0];
  if (arg instanceof FluentNone) {
    return new FluentNone(`DATETIME(${arg.valueOf()})`);
  }
  if (arg instanceof FluentDateTime) {
    return new FluentDateTime(arg.valueOf(), {
      ...arg.opts,
      ...values(opts, DATETIME_ALLOWED)
    });
  }
  if (arg instanceof FluentNumber) {
    return new FluentDateTime(arg.valueOf(), {
      ...values(opts, DATETIME_ALLOWED)
    });
  }
  throw new TypeError("Invalid argument to DATETIME");
}

// node_modules/@fluent/bundle/esm/memoizer.js
var cache = /* @__PURE__ */ new Map();
function getMemoizerForLocale(locales) {
  const stringLocale = Array.isArray(locales) ? locales.join(" ") : locales;
  let memoizer = cache.get(stringLocale);
  if (memoizer === void 0) {
    memoizer = /* @__PURE__ */ new Map();
    cache.set(stringLocale, memoizer);
  }
  return memoizer;
}

// node_modules/@fluent/bundle/esm/bundle.js
var FluentBundle = class {
  /**
   * Create an instance of `FluentBundle`.
   *
   * @example
   * ```js
   * let bundle = new FluentBundle(["en-US", "en"]);
   *
   * let bundle = new FluentBundle(locales, {useIsolating: false});
   *
   * let bundle = new FluentBundle(locales, {
   *   useIsolating: true,
   *   functions: {
   *     NODE_ENV: () => process.env.NODE_ENV
   *   }
   * });
   * ```
   *
   * @param locales - Used to instantiate `Intl` formatters used by translations.
   * @param options - Optional configuration for the bundle.
   */
  constructor(locales, { functions, useIsolating = true, transform = (v) => v } = {}) {
    this._terms = /* @__PURE__ */ new Map();
    this._messages = /* @__PURE__ */ new Map();
    this.locales = Array.isArray(locales) ? locales : [locales];
    this._functions = {
      NUMBER,
      DATETIME,
      ...functions
    };
    this._useIsolating = useIsolating;
    this._transform = transform;
    this._intls = getMemoizerForLocale(locales);
  }
  /**
   * Check if a message is present in the bundle.
   *
   * @param id - The identifier of the message to check.
   */
  hasMessage(id) {
    return this._messages.has(id);
  }
  /**
   * Return a raw unformatted message object from the bundle.
   *
   * Raw messages are `{value, attributes}` shapes containing translation units
   * called `Patterns`. `Patterns` are implementation-specific; they should be
   * treated as black boxes and formatted with `FluentBundle.formatPattern`.
   *
   * @param id - The identifier of the message to check.
   */
  getMessage(id) {
    return this._messages.get(id);
  }
  /**
   * Add a translation resource to the bundle.
   *
   * @example
   * ```js
   * let res = new FluentResource("foo = Foo");
   * bundle.addResource(res);
   * bundle.getMessage("foo");
   * // → {value: .., attributes: {..}}
   * ```
   *
   * @param res
   * @param options
   */
  addResource(res, { allowOverrides = false } = {}) {
    const errors = [];
    for (let i = 0; i < res.body.length; i++) {
      let entry = res.body[i];
      if (entry.id.startsWith("-")) {
        if (allowOverrides === false && this._terms.has(entry.id)) {
          errors.push(new Error(`Attempt to override an existing term: "${entry.id}"`));
          continue;
        }
        this._terms.set(entry.id, entry);
      } else {
        if (allowOverrides === false && this._messages.has(entry.id)) {
          errors.push(new Error(`Attempt to override an existing message: "${entry.id}"`));
          continue;
        }
        this._messages.set(entry.id, entry);
      }
    }
    return errors;
  }
  /**
   * Format a `Pattern` to a string.
   *
   * Format a raw `Pattern` into a string. `args` will be used to resolve
   * references to variables passed as arguments to the translation.
   *
   * In case of errors `formatPattern` will try to salvage as much of the
   * translation as possible and will still return a string. For performance
   * reasons, the encountered errors are not returned but instead are appended
   * to the `errors` array passed as the third argument.
   *
   * If `errors` is omitted, the first encountered error will be thrown.
   *
   * @example
   * ```js
   * let errors = [];
   * bundle.addResource(
   *     new FluentResource("hello = Hello, {$name}!"));
   *
   * let hello = bundle.getMessage("hello");
   * if (hello.value) {
   *     bundle.formatPattern(hello.value, {name: "Jane"}, errors);
   *     // Returns "Hello, Jane!" and `errors` is empty.
   *
   *     bundle.formatPattern(hello.value, undefined, errors);
   *     // Returns "Hello, {$name}!" and `errors` is now:
   *     // [<ReferenceError: Unknown variable: name>]
   * }
   * ```
   */
  formatPattern(pattern, args = null, errors = null) {
    if (typeof pattern === "string") {
      return this._transform(pattern);
    }
    let scope = new Scope(this, errors, args);
    try {
      let value = resolveComplexPattern(scope, pattern);
      return value.toString(scope);
    } catch (err) {
      if (scope.errors && err instanceof Error) {
        scope.errors.push(err);
        return new FluentNone().toString(scope);
      }
      throw err;
    }
  }
};

// node_modules/@fluent/bundle/esm/resource.js
var RE_MESSAGE_START = /^(-?[a-zA-Z][\w-]*) *= */gm;
var RE_ATTRIBUTE_START = /\.([a-zA-Z][\w-]*) *= */y;
var RE_VARIANT_START = /\*?\[/y;
var RE_NUMBER_LITERAL = /(-?[0-9]+(?:\.([0-9]+))?)/y;
var RE_IDENTIFIER = /([a-zA-Z][\w-]*)/y;
var RE_REFERENCE = /([$-])?([a-zA-Z][\w-]*)(?:\.([a-zA-Z][\w-]*))?/y;
var RE_FUNCTION_NAME = /^[A-Z][A-Z0-9_-]*$/;
var RE_TEXT_RUN = /([^{}\n\r]+)/y;
var RE_STRING_RUN = /([^\\"\n\r]*)/y;
var RE_STRING_ESCAPE = /\\([\\"])/y;
var RE_UNICODE_ESCAPE = /\\u([a-fA-F0-9]{4})|\\U([a-fA-F0-9]{6})/y;
var RE_LEADING_NEWLINES = /^\n+/;
var RE_TRAILING_SPACES = / +$/;
var RE_BLANK_LINES = / *\r?\n/g;
var RE_INDENT = /( *)$/;
var TOKEN_BRACE_OPEN = /{\s*/y;
var TOKEN_BRACE_CLOSE = /\s*}/y;
var TOKEN_BRACKET_OPEN = /\[\s*/y;
var TOKEN_BRACKET_CLOSE = /\s*] */y;
var TOKEN_PAREN_OPEN = /\s*\(\s*/y;
var TOKEN_ARROW = /\s*->\s*/y;
var TOKEN_COLON = /\s*:\s*/y;
var TOKEN_COMMA = /\s*,?\s*/y;
var TOKEN_BLANK = /\s+/y;
var FluentResource = class {
  constructor(source) {
    this.body = [];
    RE_MESSAGE_START.lastIndex = 0;
    let cursor = 0;
    while (true) {
      let next = RE_MESSAGE_START.exec(source);
      if (next === null) {
        break;
      }
      cursor = RE_MESSAGE_START.lastIndex;
      try {
        this.body.push(parseMessage(next[1]));
      } catch (err) {
        if (err instanceof SyntaxError) {
          continue;
        }
        throw err;
      }
    }
    function test(re) {
      re.lastIndex = cursor;
      return re.test(source);
    }
    function consumeChar(char, errorClass) {
      if (source[cursor] === char) {
        cursor++;
        return true;
      }
      if (errorClass) {
        throw new errorClass(`Expected ${char}`);
      }
      return false;
    }
    function consumeToken(re, errorClass) {
      if (test(re)) {
        cursor = re.lastIndex;
        return true;
      }
      if (errorClass) {
        throw new errorClass(`Expected ${re.toString()}`);
      }
      return false;
    }
    function match2(re) {
      re.lastIndex = cursor;
      let result = re.exec(source);
      if (result === null) {
        throw new SyntaxError(`Expected ${re.toString()}`);
      }
      cursor = re.lastIndex;
      return result;
    }
    function match1(re) {
      return match2(re)[1];
    }
    function parseMessage(id) {
      let value = parsePattern();
      let attributes = parseAttributes();
      if (value === null && Object.keys(attributes).length === 0) {
        throw new SyntaxError("Expected message value or attributes");
      }
      return { id, value, attributes };
    }
    function parseAttributes() {
      let attrs = /* @__PURE__ */ Object.create(null);
      while (test(RE_ATTRIBUTE_START)) {
        let name = match1(RE_ATTRIBUTE_START);
        let value = parsePattern();
        if (value === null) {
          throw new SyntaxError("Expected attribute value");
        }
        attrs[name] = value;
      }
      return attrs;
    }
    function parsePattern() {
      let first;
      if (test(RE_TEXT_RUN)) {
        first = match1(RE_TEXT_RUN);
      }
      if (source[cursor] === "{" || source[cursor] === "}") {
        return parsePatternElements(first ? [first] : [], Infinity);
      }
      let indent = parseIndent();
      if (indent) {
        if (first) {
          return parsePatternElements([first, indent], indent.length);
        }
        indent.value = trim(indent.value, RE_LEADING_NEWLINES);
        return parsePatternElements([indent], indent.length);
      }
      if (first) {
        return trim(first, RE_TRAILING_SPACES);
      }
      return null;
    }
    function parsePatternElements(elements = [], commonIndent) {
      while (true) {
        if (test(RE_TEXT_RUN)) {
          elements.push(match1(RE_TEXT_RUN));
          continue;
        }
        if (source[cursor] === "{") {
          elements.push(parsePlaceable());
          continue;
        }
        if (source[cursor] === "}") {
          throw new SyntaxError("Unbalanced closing brace");
        }
        let indent = parseIndent();
        if (indent) {
          elements.push(indent);
          commonIndent = Math.min(commonIndent, indent.length);
          continue;
        }
        break;
      }
      let lastIndex = elements.length - 1;
      let lastElement = elements[lastIndex];
      if (typeof lastElement === "string") {
        elements[lastIndex] = trim(lastElement, RE_TRAILING_SPACES);
      }
      let baked = [];
      for (let element of elements) {
        if (element instanceof Indent) {
          element = element.value.slice(0, element.value.length - commonIndent);
        }
        if (element) {
          baked.push(element);
        }
      }
      return baked;
    }
    function parsePlaceable() {
      consumeToken(TOKEN_BRACE_OPEN, SyntaxError);
      let selector = parseInlineExpression();
      if (consumeToken(TOKEN_BRACE_CLOSE)) {
        return selector;
      }
      if (consumeToken(TOKEN_ARROW)) {
        let variants = parseVariants();
        consumeToken(TOKEN_BRACE_CLOSE, SyntaxError);
        return {
          type: "select",
          selector,
          ...variants
        };
      }
      throw new SyntaxError("Unclosed placeable");
    }
    function parseInlineExpression() {
      if (source[cursor] === "{") {
        return parsePlaceable();
      }
      if (test(RE_REFERENCE)) {
        let [, sigil, name, attr = null] = match2(RE_REFERENCE);
        if (sigil === "$") {
          return { type: "var", name };
        }
        if (consumeToken(TOKEN_PAREN_OPEN)) {
          let args = parseArguments();
          if (sigil === "-") {
            return { type: "term", name, attr, args };
          }
          if (RE_FUNCTION_NAME.test(name)) {
            return { type: "func", name, args };
          }
          throw new SyntaxError("Function names must be all upper-case");
        }
        if (sigil === "-") {
          return {
            type: "term",
            name,
            attr,
            args: []
          };
        }
        return { type: "mesg", name, attr };
      }
      return parseLiteral();
    }
    function parseArguments() {
      let args = [];
      while (true) {
        switch (source[cursor]) {
          case ")":
            cursor++;
            return args;
          case void 0:
            throw new SyntaxError("Unclosed argument list");
        }
        args.push(parseArgument());
        consumeToken(TOKEN_COMMA);
      }
    }
    function parseArgument() {
      let expr = parseInlineExpression();
      if (expr.type !== "mesg") {
        return expr;
      }
      if (consumeToken(TOKEN_COLON)) {
        return {
          type: "narg",
          name: expr.name,
          value: parseLiteral()
        };
      }
      return expr;
    }
    function parseVariants() {
      let variants = [];
      let count = 0;
      let star;
      while (test(RE_VARIANT_START)) {
        if (consumeChar("*")) {
          star = count;
        }
        let key = parseVariantKey();
        let value = parsePattern();
        if (value === null) {
          throw new SyntaxError("Expected variant value");
        }
        variants[count++] = { key, value };
      }
      if (count === 0) {
        return null;
      }
      if (star === void 0) {
        throw new SyntaxError("Expected default variant");
      }
      return { variants, star };
    }
    function parseVariantKey() {
      consumeToken(TOKEN_BRACKET_OPEN, SyntaxError);
      let key;
      if (test(RE_NUMBER_LITERAL)) {
        key = parseNumberLiteral();
      } else {
        key = {
          type: "str",
          value: match1(RE_IDENTIFIER)
        };
      }
      consumeToken(TOKEN_BRACKET_CLOSE, SyntaxError);
      return key;
    }
    function parseLiteral() {
      if (test(RE_NUMBER_LITERAL)) {
        return parseNumberLiteral();
      }
      if (source[cursor] === '"') {
        return parseStringLiteral();
      }
      throw new SyntaxError("Invalid expression");
    }
    function parseNumberLiteral() {
      let [, value, fraction = ""] = match2(RE_NUMBER_LITERAL);
      let precision = fraction.length;
      return {
        type: "num",
        value: parseFloat(value),
        precision
      };
    }
    function parseStringLiteral() {
      consumeChar('"', SyntaxError);
      let value = "";
      while (true) {
        value += match1(RE_STRING_RUN);
        if (source[cursor] === "\\") {
          value += parseEscapeSequence();
          continue;
        }
        if (consumeChar('"')) {
          return { type: "str", value };
        }
        throw new SyntaxError("Unclosed string literal");
      }
    }
    function parseEscapeSequence() {
      if (test(RE_STRING_ESCAPE)) {
        return match1(RE_STRING_ESCAPE);
      }
      if (test(RE_UNICODE_ESCAPE)) {
        let [, codepoint4, codepoint6] = match2(RE_UNICODE_ESCAPE);
        let codepoint = parseInt(codepoint4 || codepoint6, 16);
        return codepoint <= 55295 || 57344 <= codepoint ? (
          // It's a Unicode scalar value.
          String.fromCodePoint(codepoint)
        ) : (
          // Lonely surrogates can cause trouble when the parsing result is
          // saved using UTF-8. Use U+FFFD REPLACEMENT CHARACTER instead.
          "\uFFFD"
        );
      }
      throw new SyntaxError("Unknown escape sequence");
    }
    function parseIndent() {
      let start2 = cursor;
      consumeToken(TOKEN_BLANK);
      switch (source[cursor]) {
        case ".":
        case "[":
        case "*":
        case "}":
        case void 0:
          return false;
        case "{":
          return makeIndent(source.slice(start2, cursor));
      }
      if (source[cursor - 1] === " ") {
        return makeIndent(source.slice(start2, cursor));
      }
      return false;
    }
    function trim(text, re) {
      return text.replace(re, "");
    }
    function makeIndent(blank) {
      let value = blank.replace(RE_BLANK_LINES, "\n");
      let length = RE_INDENT.exec(blank)[1].length;
      return new Indent(value, length);
    }
  }
};
var Indent = class {
  constructor(value, length) {
    this.value = value;
    this.length = length;
  }
};

// src/locale.mjs
function makeBundle(locale2, ftl) {
  const bundle = new FluentBundle(locale2, { useIsolating: false });
  bundle.addResource(new FluentResource(ftl));
  return bundle;
}
var localeLoaders = {
  an: () => import("./chunks/an-A6PY75MI.js"),
  ar: () => import("./chunks/ar-2HATU44Q.js"),
  ast: () => import("./chunks/ast-LR6BDCC3.js"),
  az: () => import("./chunks/az-RH4QZKKJ.js"),
  azz: () => import("./chunks/azz-3DORRJ5A.js"),
  be: () => import("./chunks/be-Z3YTUWKV.js"),
  bn: () => import("./chunks/bn-KDHMXLUX.js"),
  br: () => import("./chunks/br-2AKLHKND.js"),
  bs: () => import("./chunks/bs-C7QVOTSG.js"),
  ca: () => import("./chunks/ca-7IK5ULC3.js"),
  cak: () => import("./chunks/cak-YTL35X4P.js"),
  ckb: () => import("./chunks/ckb-UWFAJNQE.js"),
  cs: () => import("./chunks/cs-4CHTXZSU.js"),
  cy: () => import("./chunks/cy-RP2L2OUK.js"),
  da: () => import("./chunks/da-DPZF5LGO.js"),
  de: () => import("./chunks/de-SO2K4AV6.js"),
  dsb: () => import("./chunks/dsb-L7O73QFV.js"),
  el: () => import("./chunks/el-4RABOQBG.js"),
  "en-CA": () => import("./chunks/en-CA-DJ4OOLA4.js"),
  "en-GB": () => import("./chunks/en-GB-D7G7RTNJ.js"),
  "en-US": () => import("./chunks/en-US-DLTNSO5C.js"),
  "es-AR": () => import("./chunks/es-AR-6PZGYKH3.js"),
  "es-CL": () => import("./chunks/es-CL-HE4SPZ7U.js"),
  "es-ES": () => import("./chunks/es-ES-XGWIURD2.js"),
  "es-MX": () => import("./chunks/es-MX-RUTDOFMO.js"),
  et: () => import("./chunks/et-3A3F3UPB.js"),
  eu: () => import("./chunks/eu-Q6CLLOH3.js"),
  fa: () => import("./chunks/fa-AEOEUDQ4.js"),
  fi: () => import("./chunks/fi-SI2D7DPR.js"),
  fr: () => import("./chunks/fr-BTBS67DW.js"),
  "fy-NL": () => import("./chunks/fy-NL-C7AQWS3X.js"),
  gn: () => import("./chunks/gn-6SZWZLYL.js"),
  gor: () => import("./chunks/gor-4LJ2LDF3.js"),
  he: () => import("./chunks/he-DNGPDAI7.js"),
  hr: () => import("./chunks/hr-6ZNZH7ZC.js"),
  hsb: () => import("./chunks/hsb-7Q5N5UEG.js"),
  hu: () => import("./chunks/hu-BKJDP5AP.js"),
  hus: () => import("./chunks/hus-RKK3QQND.js"),
  "hy-AM": () => import("./chunks/hy-AM-TUS55PTJ.js"),
  ia: () => import("./chunks/ia-E3QH7SMP.js"),
  id: () => import("./chunks/id-STWVQPOZ.js"),
  ig: () => import("./chunks/ig-5RIZWKPI.js"),
  it: () => import("./chunks/it-BWUQHH6L.js"),
  ixl: () => import("./chunks/ixl-OTN2KR2T.js"),
  ja: () => import("./chunks/ja-VLMKIH44.js"),
  ka: () => import("./chunks/ka-RUNYPX5J.js"),
  kab: () => import("./chunks/kab-RZRU6CHD.js"),
  ko: () => import("./chunks/ko-U4AU7GYF.js"),
  lt: () => import("./chunks/lt-NFGFU7IR.js"),
  lus: () => import("./chunks/lus-3NGRCSA4.js"),
  meh: () => import("./chunks/meh-4RQCOCAF.js"),
  mix: () => import("./chunks/mix-EMJLLSA6.js"),
  ml: () => import("./chunks/ml-WNP2BYVZ.js"),
  ms: () => import("./chunks/ms-XIFIIOWT.js"),
  "nb-NO": () => import("./chunks/nb-NO-7VVUTNJN.js"),
  nl: () => import("./chunks/nl-H2SXW64B.js"),
  "nn-NO": () => import("./chunks/nn-NO-ODKDX4MF.js"),
  oc: () => import("./chunks/oc-XZIVEMM5.js"),
  "pa-IN": () => import("./chunks/pa-IN-HJI7GJVB.js"),
  pai: () => import("./chunks/pai-K3MAXPZP.js"),
  pl: () => import("./chunks/pl-GBEJ2VQO.js"),
  ppl: () => import("./chunks/ppl-C3TZCUXC.js"),
  "pt-BR": () => import("./chunks/pt-BR-CF2EYIDI.js"),
  "pt-PT": () => import("./chunks/pt-PT-G43ZZJVC.js"),
  quc: () => import("./chunks/quc-ALTXFCEH.js"),
  ro: () => import("./chunks/ro-HZFRCIZH.js"),
  ru: () => import("./chunks/ru-EUWHYN2A.js"),
  sk: () => import("./chunks/sk-7MKUKPZ6.js"),
  sl: () => import("./chunks/sl-4FPG456L.js"),
  sn: () => import("./chunks/sn-EZGOIFCF.js"),
  sq: () => import("./chunks/sq-J3KKMCHK.js"),
  sr: () => import("./chunks/sr-6HK3XGOP.js"),
  su: () => import("./chunks/su-2GJ7EZ4E.js"),
  "sv-SE": () => import("./chunks/sv-SE-WPNF6TZK.js"),
  te: () => import("./chunks/te-ARJQOBPG.js"),
  th: () => import("./chunks/th-B2CLPTBE.js"),
  tl: () => import("./chunks/tl-BX57KQRZ.js"),
  tr: () => import("./chunks/tr-QRQLXKCZ.js"),
  trs: () => import("./chunks/trs-CTWE6ZKU.js"),
  uk: () => import("./chunks/uk-5X2QADNF.js"),
  vi: () => import("./chunks/vi-RWBGSBAW.js"),
  yo: () => import("./chunks/yo-6YHN6FVV.js"),
  yua: () => import("./chunks/yua-SB77N35R.js"),
  zgh: () => import("./chunks/zgh-3HNSXICX.js"),
  "zh-CN": () => import("./chunks/zh-CN-QJOPAOYZ.js"),
  "zh-TW": () => import("./chunks/zh-TW-UQMSTAAU.js")
};
async function getTranslator(locale2) {
  const bundles = [];
  const { default: en } = await import("./chunks/en-US-DLTNSO5C.js");
  if (locale2 !== "en-US" && localeLoaders[locale2]) {
    const { default: ftl } = await localeLoaders[locale2]();
    bundles.push(makeBundle(locale2, ftl));
  }
  bundles.push(makeBundle("en-US", en));
  return function(id, data) {
    for (let bundle of bundles) {
      if (bundle.hasMessage(id)) {
        return bundle.formatPattern(bundle.getMessage(id).value, data);
      }
    }
  };
}

// src/archive.mjs
function isDupe(newFile, array) {
  for (const file of array) {
    if (newFile.name === file.name && newFile.size === file.size && newFile.lastModified === file.lastModified) {
      return true;
    }
  }
  return false;
}
var Archive = class {
  constructor(files = [], defaultTimeLimit = 86400, defaultDownloadLimit = 1) {
    this.files = Array.from(files);
    this.defaultTimeLimit = defaultTimeLimit;
    this.defaultDownloadLimit = defaultDownloadLimit;
    this.timeLimit = defaultTimeLimit;
    this.dlimit = defaultDownloadLimit;
    this.password = null;
    this.customArchiveName = null;
    this.recipientUserId = null;
    this.recipientPublicKey = null;
    this.recipientName = null;
  }
  get name() {
    if (this.files.length > 1) {
      const baseName = this.customArchiveName || "Send-Archive";
      return baseName.endsWith(".zip") ? baseName : `${baseName}.zip`;
    }
    return this.files[0].name;
  }
  setArchiveName(name) {
    if (this.files.length > 1) {
      this.customArchiveName = name;
    }
  }
  get type() {
    return this.files.length > 1 ? "send-archive" : this.files[0].type;
  }
  get size() {
    return this.files.reduce((total, file) => total + file.size, 0);
  }
  get numFiles() {
    return this.files.length;
  }
  get manifest() {
    return {
      files: this.files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))
    };
  }
  get stream() {
    return concatStream(this.files.map((file) => blobStream(file)));
  }
  addFiles(files, maxSize, maxFiles) {
    if (this.files.length + files.length > maxFiles) {
      throw new Error("tooManyFiles");
    }
    const newFiles = files.filter(
      (file) => file.size > 0 && !isDupe(file, this.files)
    );
    const newSize = newFiles.reduce((total, file) => total + file.size, 0);
    if (this.size + newSize > maxSize) {
      throw new Error("fileTooBig");
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
    this.recipientName = null;
  }
  setRecipient(userId, publicKey) {
    this.recipientUserId = userId;
    this.recipientPublicKey = publicKey;
  }
  clearRecipient() {
    this.recipientUserId = null;
    this.recipientPublicKey = null;
    this.recipientName = null;
  }
};

// src/faviconProgress.mjs
var SIZE = 32;
var LOADER_WIDTH = 5;
function drawCircle(canvas, context, color, lineWidth, outerWidth, percent2) {
  canvas.width = canvas.height = outerWidth;
  context.translate(outerWidth * 0.5, outerWidth * 0.5);
  context.rotate(-Math.PI * 0.5);
  const radius = (outerWidth - lineWidth) * 0.5;
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2 * percent2, false);
  context.strokeStyle = color;
  context.lineCap = "square";
  context.lineWidth = lineWidth;
  context.stroke();
}
function drawProgressFavicon(progressRatio, primaryColor) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  drawCircle(canvas, context, "#efefef", LOADER_WIDTH, SIZE, 1);
  drawCircle(canvas, context, primaryColor, LOADER_WIDTH, SIZE, progressRatio);
  return canvas.toDataURL();
}
function updateFavicon(progressRatio) {
  var _a, _b, _c, _d;
  let link = document.querySelector("link[rel='icon'][sizes='32x32']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.sizes = "32x32";
    document.head.appendChild(link);
  }
  const progress = progressRatio * 100;
  if (progress === 0 || progress === 100) {
    link.type = "image/png";
    const customFavicon = (_b = (_a = window.WEB_UI) == null ? void 0 : _a.CUSTOM_ASSETS) == null ? void 0 : _b.favicon_32px;
    link.href = customFavicon || "/favicon.ico";
    return;
  }
  const primaryColor = ((_d = (_c = window.WEB_UI) == null ? void 0 : _c.COLORS) == null ? void 0 : _d.PRIMARY) || "#0A84FF";
  link.href = drawProgressFavicon(progressRatio, primaryColor);
}
function updateTitle(progressRatio) {
  const percent2 = Math.floor(progressRatio * 100);
  document.title = `${percent2}% - Send`;
}
function resetTitle() {
  document.title = "Send";
}
function setupProgressIndicators() {
  let updateTitleOnProgress = false;
  window.addEventListener("blur", () => {
    updateTitleOnProgress = true;
  });
  window.addEventListener("focus", () => {
    updateTitleOnProgress = false;
    resetTitle();
    updateFavicon(0);
  });
  return {
    update: (progressRatio) => {
      if (updateTitleOnProgress) {
        updateTitle(progressRatio);
      }
      updateFavicon(progressRatio);
    },
    reset: () => {
      resetTitle();
      updateFavicon(0);
    }
  };
}

// src/controller.mjs
var Controller = class {
  constructor(rootElement) {
    this.root = rootElement;
    this.state = null;
    this.handleAddFiles = this.handleAddFiles.bind(this);
    this.handleRemoveUpload = this.handleRemoveUpload.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleUpdateOptions = this.handleUpdateOptions.bind(this);
    this.handleMetadataRequest = this.handleMetadataRequest.bind(this);
    this.handleDownloadStart = this.handleDownloadStart.bind(this);
    this.intervals = [];
    this.lastRender = 0;
    this.progressIndicators = setupProgressIndicators();
    this.ready = this.initialize();
  }
  /**
   * Initialize application state asynchronously
   * - Check browser capabilities (crypto, service worker)
   * - Register service worker if supported
   * - Load translations
   * - Create initial state object
   * - Expose state globally for debugging
   */
  async initialize() {
    const capabilities = await getCapabilities();
    if (!capabilities.crypto && window.location.pathname !== "/unsupported/crypto") {
      window.location.assign("/unsupported/crypto");
      throw new Error("Crypto not supported");
    }
    if (capabilities.serviceWorker) {
      try {
        await navigator.serviceWorker.register("/serviceWorker.js");
        await navigator.serviceWorker.ready;
        console.log("[Controller] Service Worker registered");
      } catch (e) {
        console.warn("[Controller] Service Worker registration failed:", e);
        capabilities.streamDownload = false;
      }
    }
    const translate = await getTranslator(locale());
    setTranslate(translate);
    window.translate = translate;
    this.state = {
      LIMITS,
      DEFAULTS,
      WEB_UI,
      PREFS,
      archive: new Archive([], DEFAULTS.EXPIRE_SECONDS, DEFAULTS.DOWNLOADS),
      capabilities,
      translate,
      storage: storage_default,
      transfer: null,
      fileInfo: null,
      locale: locale()
    };
    window.appState = this.state;
    console.log("[Controller] Initialization complete");
    return this.state;
  }
  /**
   * Initialize upload view - check for existing files
   * Called when upload-layout is first shown
   */
  async initializeUploadView() {
    console.log("[Controller] Initializing upload view");
    await this.checkFiles();
  }
  /**
   * Attach event listeners to the root element
   * Call this in connectedCallback()
   */
  hookupHandlers() {
    this.root.addEventListener("addfiles", this.handleAddFiles);
    this.root.addEventListener("removeupload", this.handleRemoveUpload);
    this.root.addEventListener("upload", this.handleUpload);
    this.root.addEventListener("cancel", this.handleCancel);
    this.root.addEventListener("delete", this.handleDelete);
    this.root.addEventListener("copy", this.handleCopy);
    this.root.addEventListener("share", this.handleShare);
    this.root.addEventListener("updateoptions", this.handleUpdateOptions);
    this.root.addEventListener("metadata-request", this.handleMetadataRequest);
    this.root.addEventListener("download-start", this.handleDownloadStart);
    this.intervals.push(setInterval(() => this.checkFiles(), 60 * 1e3));
    this.intervals.push(
      setInterval(() => this.rerenderCountdowns(), 60 * 1e3)
    );
    console.log("[Controller] Event handlers attached");
  }
  /**
   * Remove event listeners and clean up intervals
   * Call this in disconnectedCallback()
   */
  destroyHandlers() {
    this.root.removeEventListener("addfiles", this.handleAddFiles);
    this.root.removeEventListener("removeupload", this.handleRemoveUpload);
    this.root.removeEventListener("upload", this.handleUpload);
    this.root.removeEventListener("cancel", this.handleCancel);
    this.root.removeEventListener("delete", this.handleDelete);
    this.root.removeEventListener("copy", this.handleCopy);
    this.root.removeEventListener("share", this.handleShare);
    this.root.removeEventListener("updateoptions", this.handleUpdateOptions);
    this.root.removeEventListener(
      "metadata-request",
      this.handleMetadataRequest
    );
    this.root.removeEventListener("download-start", this.handleDownloadStart);
    this.intervals.forEach((id) => clearInterval(id));
    this.intervals = [];
    console.log("[Controller] Event handlers destroyed");
  }
  /**
   * Event Handlers
   */
  async handleAddFiles(event) {
    const { files } = event.detail;
    if (files.length < 1) {
      return;
    }
    console.log("[Controller] Adding files:", files);
    const maxSize = this.state.LIMITS.MAX_FILE_SIZE;
    try {
      this.state.archive.addFiles(
        files,
        maxSize,
        this.state.LIMITS.MAX_FILES_PER_ARCHIVE
      );
      this._showUploadAreaError(null);
      if (this.root.currentLayout && typeof this.root.currentLayout.refreshArchiveState === "function") {
        this.root.currentLayout.refreshArchiveState();
      }
    } catch (e) {
      console.error("[Controller] Error adding files:", e);
      this._handleAddFilesError(e);
    }
  }
  handleRemoveUpload(event) {
    const { file } = event.detail;
    console.log("[Controller] Removing upload:", file);
    this.state.archive.remove(file);
    if (this.state.archive.numFiles === 0) {
      this.state.archive.clear();
    }
    this._showUploadAreaError(null);
    if (this.root.currentLayout && typeof this.root.currentLayout.refreshArchiveState === "function") {
      this.root.currentLayout.refreshArchiveState();
    }
  }
  handleUpdateOptions(event) {
    const {
      timeLimit,
      downloadLimit,
      password,
      archiveName,
      recipientUserId,
      recipientPublicKey,
      recipientName
    } = event.detail;
    const archive = this.state.archive;
    if (!archive) {
      return;
    }
    if (typeof timeLimit === "number" && !Number.isNaN(timeLimit)) {
      archive.timeLimit = timeLimit;
    }
    if (typeof downloadLimit === "number" && !Number.isNaN(downloadLimit)) {
      archive.dlimit = downloadLimit;
    }
    if (password !== void 0) {
      archive.password = password ? password : null;
    }
    if (archiveName !== void 0) {
      archive.customArchiveName = archiveName ? archiveName : null;
    }
    if (recipientUserId !== void 0 || recipientPublicKey !== void 0) {
      if (recipientUserId && recipientPublicKey) {
        archive.setRecipient(recipientUserId, recipientPublicKey);
        if (recipientName) {
          archive.recipientName = recipientName;
        }
      } else {
        archive.clearRecipient();
        archive.recipientName = null;
      }
    }
    console.log("[Controller] Updated archive options", {
      timeLimit: archive.timeLimit,
      downloadLimit: archive.dlimit,
      password: archive.password ? "***" : null,
      recipientName: archive.recipientName
    });
  }
  async handleUpload(event) {
    console.log("[Controller] Starting upload");
    if (this.state.storage.files.length >= this.state.LIMITS.MAX_ARCHIVES_PER_USER) {
      console.warn("[Controller] Too many archives");
      return;
    }
    const archive = this.state.archive;
    const sender = new FileSender();
    sender.addEventListener("progress", () => this.updateProgress());
    sender.addEventListener("encrypting", () => this.render());
    sender.addEventListener("complete", () => this.render());
    this.state.transfer = sender;
    this.state.uploading = true;
    this.render();
    if (this.root.currentLayout && typeof this.root.currentLayout.refreshArchiveState === "function") {
      this.root.currentLayout.refreshArchiveState();
    }
    const links = openLinksInNewTab();
    await delay(200);
    try {
      const ownedFile = await sender.upload(archive);
      this.state.storage.totalUploads += 1;
      this.progressIndicators.reset();
      this.state.storage.addFile(ownedFile);
      if (archive.password) {
        await this.handlePassword({
          password: archive.password,
          file: ownedFile
        });
      }
      console.log("[Controller] Upload complete:", ownedFile);
      this.state.uploading = false;
      this.state.transfer = null;
      archive.clear();
      await this.state.storage.merge();
      if (this.root.currentLayout && this.root.currentLayout.setUploadComplete) {
        this.root.currentLayout.setUploadComplete(ownedFile);
      }
    } catch (err) {
      if (err.message === "0") {
        console.log("[Controller] Upload cancelled");
        openLinksInNewTab(links, false);
        archive.clear();
        this.state.uploading = false;
        this.state.transfer = null;
        await this.state.storage.merge();
        this.render();
        if (this.root.currentLayout && typeof this.root.currentLayout.refreshArchiveState === "function") {
          this.root.currentLayout.refreshArchiveState();
        }
      } else {
        console.error("[Controller] Upload error:", err);
        this.state.uploading = false;
        this.state.transfer = null;
        this.render();
        this._showUploadError(err.message || "An error occurred during upload");
      }
    }
  }
  handleCancel(event) {
    console.log("[Controller] Cancelling upload");
    if (this.state.transfer) {
      this.state.transfer.cancel();
      this.progressIndicators.reset();
    }
    if (this.root.currentLayout && typeof this.root.currentLayout.refreshArchiveState === "function") {
      this.root.currentLayout.refreshArchiveState();
    }
  }
  async handleDelete(event) {
    const { ownedFile } = event.detail;
    console.log("[Controller] Deleting file:", ownedFile);
    try {
      this.state.storage.remove(ownedFile.id);
      await ownedFile.del();
      if (this.root.currentLayout && typeof this.root.currentLayout.refreshUploadList === "function") {
        this.root.currentLayout.refreshUploadList();
      }
    } catch (e) {
      console.error("[Controller] Error deleting file:", e);
    }
  }
  handleCopy(event) {
    const { url } = event.detail;
    console.log("[Controller] Copying to clipboard:", url);
    copyToClipboard(url);
  }
  handleShare(event) {
    const { url, name } = event.detail;
    console.log("[Controller] Sharing:", { url, name });
    if (navigator.share) {
      navigator.share({
        title: name,
        url
      }).catch((err) => console.log("[Controller] Share cancelled:", err));
    } else {
      this.handleCopy({ detail: { url } });
    }
  }
  /**
   * Helper Methods
   */
  async handlePassword({ password, file }) {
    try {
      this.state.settingPassword = true;
      this.render();
      await file.setPassword(password);
      this.state.storage.writeFile(file);
      await delay(1e3);
    } catch (err) {
      console.error("[Controller] Error setting password:", err);
      this.state.passwordSetError = err;
    } finally {
      this.state.settingPassword = false;
    }
    this.render();
  }
  updateProgress() {
    if (!this.state.transfer) return;
    const ratio = this.state.transfer.progressRatio;
    if (this.root.currentLayout && this.root.currentLayout.updateProgress) {
      const bytesUploaded = this.state.transfer.progress[0];
      const totalBytes = this.state.transfer.progress[1];
      this.root.currentLayout.updateProgress(ratio, bytesUploaded, totalBytes);
    }
    this.progressIndicators.update(ratio);
  }
  /**
   * Check for file updates (download counts, expiration, etc.)
   * Called periodically and on initial load
   */
  async checkFiles() {
    let needsRender = false;
    if (this.state.storage.user) {
      try {
        const fileCountBefore = this.state.storage.files.length;
        await syncOwnedFiles(this.state.storage.user);
        const fileCountAfter = this.state.storage.files.length;
        if (fileCountAfter > fileCountBefore) {
          needsRender = true;
        }
      } catch (err) {
        console.warn("[Controller] Failed to sync file list from server", err);
      }
    }
    const changes = await this.state.storage.merge();
    if (changes.downloadCount || changes.outgoing || changes.incoming || needsRender) {
      this.render();
    }
  }
  /**
   * Re-render the upload list to update countdown timers
   * Called every minute to update "expires in X minutes" displays
   */
  rerenderCountdowns() {
    const now = Date.now();
    const hasFiles = this.state.storage && this.state.storage.files.length > 0;
    const isUploadView = this.root.currentLayout && this.root.currentLayout.tagName === "UPLOAD-LAYOUT";
    const needsUpdate = now - this.lastRender > 3e4;
    if (hasFiles && isUploadView && needsUpdate) {
      console.log("[Controller] Updating countdown timers");
      this.render();
    }
  }
  render() {
    this.lastRender = Date.now();
    const layout = this.root.currentLayout;
    if (layout && layout.tagName === "UPLOAD-LAYOUT" && typeof layout.refreshUploadList === "function") {
      layout.refreshUploadList();
    }
    console.log("[Controller] Render requested");
  }
  _translate(key, fallback, params) {
    const translator = this.state.translate || window.translate;
    if (typeof translator === "function") {
      try {
        const value = translator(key, params);
        if (value) {
          return value;
        }
      } catch (err) {
      }
    }
    return fallback;
  }
  _handleAddFilesError(error) {
    let message = "";
    if (error && error.message === "tooManyFiles") {
      message = this._translate(
        "tooManyFiles",
        `Too many files (max ${this.state.LIMITS.MAX_FILES_PER_ARCHIVE})`,
        {
          count: this.state.LIMITS.MAX_FILES_PER_ARCHIVE,
          size: bytes(this.state.LIMITS.MAX_FILE_SIZE)
        }
      );
    } else if (error && error.message === "fileTooBig") {
      message = this._translate(
        "fileTooBig",
        `That file is too big (max ${bytes(this.state.LIMITS.MAX_FILE_SIZE)})`,
        {
          size: bytes(this.state.LIMITS.MAX_FILE_SIZE)
        }
      );
    }
    if (message) {
      this._showUploadAreaError(message);
    } else {
      this._showUploadAreaError(null);
    }
  }
  _showUploadAreaError(message) {
    const layout = this.root.currentLayout;
    if (!layout || !layout.uploadArea) {
      return;
    }
    if (message && typeof layout.uploadArea.showError === "function") {
      layout.uploadArea.showError(message);
    } else if (!message) {
      if (typeof layout.uploadArea.clearError === "function") {
        layout.uploadArea.clearError();
      } else if (typeof layout.uploadArea.showError === "function") {
        layout.uploadArea.showError(null);
      }
    }
  }
  _showUploadError(message) {
    const layout = this.root.currentLayout;
    if (!layout || !layout.uploadArea) {
      return;
    }
    if (typeof layout.uploadArea.showErrorView === "function") {
      layout.uploadArea.showErrorView(message);
    }
  }
  /**
   * Download Event Handlers
   */
  /**
   * Handle metadata-request event from download-layout
   * Creates FileReceiver and fetches file metadata
   */
  async handleMetadataRequest(event) {
    const { fileInfo } = event.detail;
    console.log("[Controller] Metadata request for file:", fileInfo.id);
    this.state.fileInfo = fileInfo;
    const receiver = new FileReceiver(fileInfo);
    try {
      await receiver.getMetadata();
      this.state.transfer = receiver;
      Object.assign(this.state.fileInfo, {
        name: receiver.fileInfo.name,
        type: receiver.fileInfo.type,
        size: receiver.fileInfo.size,
        manifest: receiver.fileInfo.manifest,
        iv: receiver.fileInfo.iv
      });
      console.log("[Controller] Metadata fetched successfully:", {
        name: receiver.fileInfo.name,
        size: receiver.fileInfo.size,
        type: receiver.fileInfo.type
      });
      const layout = this.root.currentLayout;
      if (layout && typeof layout.showOverviewView === "function") {
        layout.showOverviewView(this.state.fileInfo);
      }
    } catch (e) {
      console.error("[Controller] Error fetching metadata:", e);
      if (e.message === "401") {
        const layout = this.root.currentLayout;
        if (layout && typeof layout.showPasswordView === "function") {
          const translate = this.state.translate || window.translate;
          const errorMsg = translate ? translate("passwordTryAgain") : "Incorrect password. Please try again.";
          layout.showPasswordView(errorMsg);
        }
      } else if (e.message === "404") {
        const layout = this.root.currentLayout;
        if (layout && typeof layout.showErrorView === "function") {
          const translate = this.state.translate || window.translate;
          const errorMsg = translate ? translate("notFoundDescription") : "File not found or expired.";
          layout.showErrorView(errorMsg);
        }
      } else {
        const layout = this.root.currentLayout;
        if (layout && typeof layout.showErrorView === "function") {
          layout.showErrorView(
            "An error occurred while fetching file information."
          );
        }
      }
    }
  }
  /**
   * Handle download-start event from file-overview view
   * Starts the actual file download
   */
  async handleDownloadStart(event) {
    console.log("[Controller] Download start");
    if (!this.state.transfer) {
      console.error("[Controller] No transfer (FileReceiver) in state");
      return;
    }
    const receiver = this.state.transfer;
    receiver.addEventListener("progress", () => {
      this.updateDownloadProgress();
    });
    receiver.addEventListener("decrypting", () => {
      console.log("[Controller] Decrypting file...");
    });
    receiver.addEventListener("complete", () => {
      console.log("[Controller] Download complete");
      this.handleDownloadComplete();
    });
    try {
      const useStream = this.state.capabilities.streamDownload;
      await receiver.download({ stream: useStream });
      this.state.storage.totalDownloads += 1;
    } catch (err) {
      console.error("[Controller] Download error:", err);
      if (err.message === "0") {
        receiver.reset();
        this.progressIndicators.reset();
        const layout = this.root.currentLayout;
        if (layout && typeof layout.showOverviewView === "function") {
          layout.showOverviewView(this.state.fileInfo);
        }
      } else if (err.message === "404") {
        const layout = this.root.currentLayout;
        if (layout && typeof layout.showErrorView === "function") {
          const translate = this.state.translate || window.translate;
          const errorMsg = translate ? translate("notFoundDescription") : "File not found or expired.";
          layout.showErrorView(errorMsg);
        }
      } else {
        const layout = this.root.currentLayout;
        if (layout && typeof layout.showErrorView === "function") {
          layout.showErrorView("An error occurred during download.");
        }
      }
    }
  }
  /**
   * Update download progress (called during download)
   */
  updateDownloadProgress() {
    if (!this.state.transfer) return;
    const receiver = this.state.transfer;
    const ratio = receiver.progressRatio;
    const bytesDownloaded = receiver.progress[0];
    const totalBytes = receiver.progress[1];
    const layout = this.root.currentLayout;
    if (layout && typeof layout.updateProgress === "function") {
      layout.updateProgress(ratio, bytesDownloaded, totalBytes);
    }
    this.progressIndicators.update(ratio);
  }
  /**
   * Handle download complete
   */
  handleDownloadComplete() {
    console.log("[Controller] Download completed successfully");
    this.progressIndicators.reset();
    const layout = this.root.currentLayout;
    if (layout && typeof layout.showFinishedView === "function") {
      layout.showFinishedView();
    }
    this.state.transfer = null;
  }
};

// src/ui/go-send.mjs
var GoSendElement = class extends HTMLElement {
  constructor() {
    super();
    this.currentView = null;
    this.currentLayout = null;
    this.controller = new Controller(this);
    this._initFrame = null;
    this._templateMounted = false;
  }
  /**
   * Convenience getter for state (delegates to controller)
   */
  get state() {
    return this.controller ? this.controller.state : null;
  }
  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("go-send");
      if (!template) {
        console.error("Template #go-send not found");
        return;
      }
      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this._templateMounted = true;
    }
    if (this._initFrame !== null) {
      cancelAnimationFrame(this._initFrame);
    }
    this._initFrame = requestAnimationFrame(async () => {
      this._initFrame = null;
      if (!this.isConnected) {
        return;
      }
      await this.controller.ready;
      if (!this.isConnected) {
        return;
      }
      translateElement(this);
      this.controller.hookupHandlers();
    });
  }
  disconnectedCallback() {
    if (this._initFrame !== null) {
      cancelAnimationFrame(this._initFrame);
      this._initFrame = null;
    }
    if (this.controller) {
      this.controller.destroyHandlers();
      this.controller = null;
    }
  }
  showUploadLayout() {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }
    slot.innerHTML = "";
    const uploadLayout = document.createElement("upload-layout");
    slot.appendChild(uploadLayout);
    this.currentLayout = uploadLayout;
    this.currentView = "upload";
    if (this.controller && typeof this.controller.initializeUploadView === "function") {
      this.controller.initializeUploadView();
    }
  }
  showDownloadLayout() {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }
    slot.innerHTML = "";
    const downloadLayout = document.createElement("download-layout");
    slot.appendChild(downloadLayout);
    this.currentLayout = downloadLayout;
    this.currentView = "download";
  }
  showRegisterLayout() {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }
    slot.innerHTML = "";
    const registerLayout = document.createElement("register-layout");
    slot.appendChild(registerLayout);
    this.currentLayout = registerLayout;
    this.currentView = "register";
  }
  showLoginLayout() {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }
    slot.innerHTML = "";
    const loginLayout = document.createElement("login-layout");
    slot.appendChild(loginLayout);
    this.currentLayout = loginLayout;
    this.currentView = "login";
  }
  showSettingsLayout() {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }
    slot.innerHTML = "";
    const settingsLayout = document.createElement("settings-layout");
    slot.appendChild(settingsLayout);
    this.currentLayout = settingsLayout;
    this.currentView = "settings";
  }
  showErrorLayout(errorMessage) {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }
    slot.innerHTML = "";
    const errorLayout = document.createElement("error-layout");
    if (errorMessage) {
      errorLayout.setAttribute("message", errorMessage);
    }
    slot.appendChild(errorLayout);
    this.currentLayout = errorLayout;
    this.currentView = "error";
  }
};
customElements.define("go-send", GoSendElement);

// src/ui/app-footer.mjs
function showElement(el) {
  if (el) {
    el.classList.remove("hidden");
  }
}
function hideElement(el) {
  if (el) {
    el.classList.add("hidden");
  }
}
var AppFooter = class extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._frame = null;
    this.config = window.FOOTER || {};
    this._boundHandlers = {
      handleLogoutClick: this.handleLogoutClick.bind(this)
    };
  }
  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("app-footer");
      if (!template) {
        console.error("Template #app-footer not found");
        return;
      }
      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this._templateMounted = true;
    }
    if (this._frame !== null) {
      cancelAnimationFrame(this._frame);
    }
    this._frame = requestAnimationFrame(() => {
      this._frame = null;
      if (!this.isConnected) return;
      translateElement(this);
      this._waitForTranslateAndSetup();
    });
  }
  _waitForTranslateAndSetup() {
    if (window.translate && typeof window.translate === "function") {
      this.setupFooter();
    } else {
      setTimeout(() => {
        if (this.isConnected) {
          this._waitForTranslateAndSetup();
        }
      }, 100);
    }
  }
  disconnectedCallback() {
    if (this._frame !== null) {
      cancelAnimationFrame(this._frame);
      this._frame = null;
    }
    const authLink = this.querySelector('[data-role="auth-link"]');
    if (authLink && authLink.href.includes("/logout")) {
      authLink.removeEventListener(
        "click",
        this._boundHandlers.handleLogoutClick
      );
    }
  }
  setupFooter() {
    const statusDot = this.querySelector('[data-role="status-dot"]');
    if (statusDot) {
      const isDownload = window.location.pathname.match(/^\/download/) || window.location.pathname.match(/^\/[0-9a-fA-F]{10,16}/);
      statusDot.className = isDownload ? "status-dot status-dot-blue" : "status-dot status-dot-green";
    }
    const customLi = this.querySelector("[data-if-custom]");
    const customLink = this.querySelector('[data-role="custom-link"]');
    const customText = this.querySelector('[data-role="custom-text"]');
    if (this.config.CustomText) {
      if (customText) customText.textContent = this.config.CustomText;
      if (this.config.CustomURL && customLink) {
        customLink.href = this.config.CustomURL;
        customLink.target = "_blank";
      } else if (customLink) {
        const span = document.createElement("span");
        span.textContent = this.config.CustomText;
        customLink.replaceWith(span);
      }
      if (customLi) showElement(customLi);
    } else {
      if (customLi) hideElement(customLi);
    }
    const dmcaLi = this.querySelector("[data-if-dmca]");
    const dmcaLink = this.querySelector('[data-role="dmca-link"]');
    if (this.config.DMCAURL) {
      if (dmcaLink) {
        dmcaLink.href = this.config.DMCAURL;
        dmcaLink.target = "_blank";
      }
      if (dmcaLi) showElement(dmcaLi);
    } else {
      if (dmcaLi) hideElement(dmcaLi);
    }
    const sourceLi = this.querySelector("[data-if-source]");
    const sourceFooterLink = this.querySelector(
      '[data-role="source-link-footer"]'
    );
    if (this.config.SourceURL) {
      if (sourceFooterLink) {
        sourceFooterLink.href = this.config.SourceURL;
        sourceFooterLink.target = "_blank";
      }
      if (sourceLi) showElement(sourceLi);
    } else {
      if (sourceLi) hideElement(sourceLi);
    }
    const usernameSpan = this.querySelector('[data-role="username"]');
    const authLink = this.querySelector('[data-role="auth-link"]');
    const authLabel = this.querySelector('[data-role="auth-label"]');
    const user = storage_default.user;
    const guestCookie = hasGuestToken();
    const rawRole = user == null ? void 0 : user.role;
    const isGuestRole = rawRole === USER_ROLES.GUEST || typeof rawRole === "string" && rawRole.trim().toLowerCase() === "guest";
    const hasGuest = guestCookie || isGuestRole && !user;
    const guestLabel = hasGuest ? getGuestLabel() : null;
    if (usernameSpan) {
      if (user && user.name) {
        usernameSpan.textContent = user.name;
        showElement(usernameSpan);
      } else if (guestLabel) {
        usernameSpan.textContent = guestLabel;
        showElement(usernameSpan);
      } else {
        hideElement(usernameSpan);
      }
    }
    if (authLink && authLabel) {
      authLink.removeEventListener(
        "click",
        this._boundHandlers.handleLogoutClick
      );
      authLink.removeAttribute("target");
      if (user || hasGuest) {
        authLink.href = "/logout";
        authLabel.id = "footerLinkLogout";
        authLabel.removeAttribute("data-type");
        authLabel.textContent = this._translate("footerLinkLogout", "Sign out");
        authLink.addEventListener(
          "click",
          this._boundHandlers.handleLogoutClick
        );
        const isTrusted = storage_default.getTrustPreference();
        const rawRole2 = user == null ? void 0 : user.role;
        const isGuestRole2 = rawRole2 === USER_ROLES.GUEST || typeof rawRole2 === "string" && rawRole2.trim().toLowerCase() === "guest";
        const securityIcon = this.querySelector('[data-role="security-warning-icon"]');
        if (securityIcon) {
          if (!isTrusted || hasGuest || isGuestRole2) {
            const guestOnly = hasGuest && !user;
            const key = guestOnly ? "uploadGuestBannerMessageGuest" : "uploadGuestBannerMessageEphemeral";
            const tooltipText = this._translateText(
              key,
              guestOnly ? "Remember to logout on untrusted devices!" : "This computer isn't trusted! Remember to sign out!"
            );
            const existingTooltip = securityIcon.querySelector('[data-role="tooltip"]');
            if (existingTooltip) {
              existingTooltip.remove();
            }
            tooltip(securityIcon, tooltipText, {
              position: "top",
              default: "open"
            });
            showElement(securityIcon);
          } else {
            hideElement(securityIcon);
          }
        }
      } else {
        authLink.href = "/login";
        authLabel.id = "footerLinkLogin";
        authLabel.removeAttribute("data-type");
        authLabel.textContent = this._translate("footerLinkLogin", "Sign in");
        const securityIcon = this.querySelector('[data-role="security-warning-icon"]');
        if (securityIcon) {
          hideElement(securityIcon);
        }
      }
      translateElement(this);
    }
    const settingsLi = this.querySelector("[data-if-settings]");
    if (settingsLi) {
      if (user) {
        showElement(settingsLi);
      } else {
        hideElement(settingsLi);
      }
    }
  }
  handleLogoutClick(event) {
    storage_default.clearAll();
  }
  _translate(key, fallback) {
    if (window.translate) {
      try {
        return window.translate(key);
      } catch (err) {
        console.warn("[AppFooter] Missing translation for", key, err);
      }
    }
    return fallback;
  }
  _translateText(key, fallback, args = {}) {
    if (window.translate && typeof window.translate === "function") {
      try {
        const result = window.translate(key);
        if (result && result !== key) return result;
      } catch (e) {
        console.warn("[AppFooter] Error with window.translate:", key, e);
      }
    }
    return fallback;
  }
};
customElements.define("app-footer", AppFooter);

// src/router.mjs
async function initUploadRoute(app) {
  console.log("[Route] Initializing upload page...");
  await Promise.all([
    import("./chunks/upload-layout-DFS3ROWS.js"),
    import("./chunks/upload-area-MOZOQFJO.js"),
    import("./chunks/upload-right-M23VWDD6.js"),
    app.controller.ready
  ]);
  app.showUploadLayout();
  console.log("[Route] Upload page ready");
}
async function initDownloadRoute(app) {
  console.log("[Route] Initializing download page...");
  await Promise.all([
    import("./chunks/download-layout-3LFQU4VZ.js"),
    import("./chunks/file-password-IAMWH3LL.js"),
    import("./chunks/file-overview-DPWK5SCW.js"),
    import("./chunks/file-downloading-NYJFEL2T.js"),
    import("./chunks/file-finished-KI5FWEUS.js"),
    import("./chunks/file-error-DA3PZDO3.js"),
    app.controller.ready
  ]);
  app.showDownloadLayout();
  console.log("[Route] Download page ready");
}
async function initRegisterRoute(app) {
  console.log("[Route] Initializing register page...");
  await Promise.all([
    import("./chunks/register-layout-KINE7CQ2.js"),
    app.controller.ready
  ]);
  app.showRegisterLayout();
  console.log("[Route] Register page ready");
}
async function initLoginRoute(app) {
  console.log("[Route] Initializing login page...");
  await Promise.all([
    import("./chunks/login-layout-WDPFC3YZ.js"),
    app.controller.ready
  ]);
  app.showLoginLayout();
  console.log("[Route] Login page ready");
}
async function initSettingsRoute(app) {
  console.log("[Route] Initializing settings page...");
  await Promise.all([
    import("./chunks/settings-layout-QDV3METK.js"),
    import("./chunks/settings-account-panel-ATOTIBNS.js"),
    import("./chunks/settings-upload-links-panel-PRYP6D32.js"),
    import("./chunks/settings-users-panel-2KJ62NYL.js"),
    import("./chunks/settings-logs-panel-GKBALGDJ.js"),
    app.controller.ready
  ]);
  app.showSettingsLayout();
  console.log("[Route] Settings page ready");
}
async function bootstrapApplication() {
  const user = storage_default.user;
  if (user && user.version && user.version !== APP_VERSION) {
    console.warn(`[App] Version mismatch: stored ${user.version}, current ${APP_VERSION}. Clearing localStorage.`);
    storage_default.clearAll();
  }
  if (storage_default.user) {
    syncOwnedFiles(storage_default.user).catch((err) => {
      console.warn("[App] File sync failed during startup", err);
    });
  }
}

// src/main.mjs
(async function start() {
  await bootstrapApplication();
  const app = document.querySelector("go-send");
  if (!app) {
    console.warn("[Router] <go-send> element not found in DOM");
    return;
  }
  await navigate(window.location.pathname, app);
  window.addEventListener("popstate", async () => {
    await navigate(window.location.pathname, app);
  });
  console.log("[Router] Route initialized");
})();
var AUTH_STATE = {
  NONE: "none",
  GUEST: "guest",
  USER: "user"
};
function getAuthState() {
  const user = storage_default.user;
  if (!user) {
    return hasGuestToken() ? AUTH_STATE.GUEST : AUTH_STATE.NONE;
  }
  const isTrusted = storage_default.getTrustPreference();
  if (!isTrusted) {
    const sessionValid = sessionStorage.getItem("session_valid");
    if (!sessionValid) {
      console.log("[Auth] Ephemeral session expired (browser restart detected)");
      window.location.assign("/logout");
      return AUTH_STATE.NONE;
    }
  }
  return AUTH_STATE.USER;
}
async function navigate(path, app) {
  var _a;
  if (path.match(/^\/download/) || path.match(/^\/[0-9a-fA-F]{10,16}/)) {
    await initDownloadRoute(app);
    return;
  }
  if (path.startsWith("/login")) {
    await initLoginRoute(app);
    return;
  }
  if (path.startsWith("/register")) {
    await initRegisterRoute(app);
    return;
  }
  const uploadGuardEnabled = ((_a = window.FEATURES) == null ? void 0 : _a.UploadGuard) ?? false;
  const isProtectedRoute = path === "/" || path.startsWith("/upload") || path === "/settings";
  const authState = getAuthState();
  if (uploadGuardEnabled && isProtectedRoute) {
    if (authState === AUTH_STATE.NONE) {
      console.log("[Auth] Protected route requires authentication, redirecting to /login");
      window.location.assign("/login");
      return;
    }
    if (authState === AUTH_STATE.GUEST && path === "/settings") {
      window.location.replace("/");
      return;
    }
  }
  if (path === "/" || path.startsWith("/upload")) {
    await initUploadRoute(app);
  } else if (path === "/settings") {
    if (authState === AUTH_STATE.USER) {
      await initSettingsRoute(app);
    } else {
      window.location.replace("/");
    }
  } else {
    console.warn(`[Router] Unknown route: ${path}, defaulting to upload`);
    await initUploadRoute(app);
  }
}
//# sourceMappingURL=main.js.map
