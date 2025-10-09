/*
  This code is included by both the server and frontend via
  common/assets.js

  When included from the server the export will be the function.

  When included from the frontend (via webpack) the export will
  be an object mapping file names to hashed file names. Example:
  "send_logo.svg": "send_logo.5fcfdf0e.svg"
*/

import { resolve, join } from "path";
import { fs } from "fs";

function kv(f) {
  return `"${f}": require('../assets/${f}')`;
}

export default function () {
  const files = fs.readdirSync(join(__dirname, "..", "assets"));
  const code = `module.exports = {
    ${files.map(kv).join(",\n")}
  };`;
  return {
    code,
    dependencies: files.map((f) => resolve("../assets/" + f)),
    cacheable: true,
  };
}
