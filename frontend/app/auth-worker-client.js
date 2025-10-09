/**
 * This module manages a singleton instance of the authentication Web Worker.
 * This ensures that the worker, and the cryptographic keys it holds in memory,
 * persist across the entire application lifecycle, even when components like
 * the login form are created and destroyed.
 */

let workerInstance = null;

export function getWorker() {
  if (!workerInstance) {
    workerInstance = new Worker(new URL("../auth-worker.js", import.meta.url), {
      type: "module",
    });
  }
  return workerInstance;
}

/**
 * Sends a command to the shared authentication worker and returns a promise
 * that resolves with the result.
 *
 * @param {string} command The command to execute in the worker.
 * @param {object} data The data payload for the command.
 * @returns {Promise<any>}
 */
export function workerCommand(command, data) {
  const worker = getWorker();
  return new Promise((resolve, reject) => {
    const messageListener = (event) => {
      // Only handle messages that correspond to the command we sent
      if (event.data.command === command) {
        worker.removeEventListener("message", messageListener);
        if (event.data.status === "SUCCESS") {
          resolve(event.data.result);
        } else {
          reject(new Error(event.data.message || "Worker command failed"));
        }
      }
    };
    worker.addEventListener("message", messageListener);
    worker.postMessage({ command, data });
  });
}
