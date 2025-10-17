/* global TransformStream */

export function transformStream(readable, transformer = {}, oncancel) {
  const reader = readable.getReader();
  const wrappedTransformer = transformer || {};

  return new ReadableStream({
    async start(controller) {
      if (wrappedTransformer.start) {
        await wrappedTransformer.start(controller);
      }
    },

    async pull(controller) {
      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          if (wrappedTransformer.flush) {
            await wrappedTransformer.flush(controller);
          }
          reader.releaseLock();
          controller.close();
          return;
        }

        if (!wrappedTransformer.transform) {
          controller.enqueue(value);
          return;
        }

        let enqueued = false;
        const wrappedController = {
          enqueue(chunk) {
            enqueued = true;
            controller.enqueue(chunk);
          }
        };

        await wrappedTransformer.transform(value, wrappedController);

        if (enqueued) {
          return;
        }
        // If nothing was enqueued, loop to read the next chunk.
      }
    },

    cancel(reason) {
      reader.cancel(reason);
      if (wrappedTransformer.cancel) {
        wrappedTransformer.cancel(reason);
      }
      if (oncancel) {
        oncancel(reason);
      }
    }
  });
}

class BlobStreamController {
  constructor(blob, size) {
    this.blob = blob;
    this.index = 0;
    this.chunkSize = size || 1024 * 64;
  }

  pull(controller) {
    return new Promise((resolve, reject) => {
      const bytesLeft = this.blob.size - this.index;
      if (bytesLeft <= 0) {
        controller.close();
        return resolve();
      }
      const size = Math.min(this.chunkSize, bytesLeft);
      const slice = this.blob.slice(this.index, this.index + size);
      const reader = new FileReader();
      reader.onload = () => {
        controller.enqueue(new Uint8Array(reader.result));
        resolve();
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(slice);
      this.index += size;
    });
  }
}

export function blobStream(blob, size) {
  return new ReadableStream(new BlobStreamController(blob, size));
}

class ConcatStreamController {
  constructor(streams) {
    this.streams = streams;
    this.index = 0;
    this.reader = null;
    this.nextReader();
  }

  nextReader() {
    const next = this.streams[this.index++];
    this.reader = next && next.getReader();
  }

  async pull(controller) {
    if (!this.reader) {
      return controller.close();
    }
    const data = await this.reader.read();
    if (data.done) {
      this.nextReader();
      return this.pull(controller);
    }
    controller.enqueue(data.value);
  }
}

export function concatStream(streams) {
  return new ReadableStream(new ConcatStreamController(streams));
}
