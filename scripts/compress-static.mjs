import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { brotliCompress, constants, gzip } from "node:zlib";

const brotli = promisify(brotliCompress);
const gz = promisify(gzip);

// vinext's production static cache negotiates existing .br/.gz sidecars.
// Keep originals for clients without compression and Cloudflare edge delivery.
async function compressDirectory(directory) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) {
      count += await compressDirectory(file);
    } else if (/\.(?:js|css)$/.test(entry.name)) {
      const original = await readFile(file);
      const [br, gzipBytes] = await Promise.all([
        brotli(original, { params: { [constants.BROTLI_PARAM_QUALITY]: 6 } }),
        gz(original, { level: 9 }),
      ]);
      await Promise.all([
        writeFile(`${file}.br`, br),
        writeFile(`${file}.gz`, gzipBytes),
      ]);
      count += 1;
    }
  }
  return count;
}

const count = await compressDirectory(fileURLToPath(new URL("../dist/client/_next/static/", import.meta.url)));
console.log(`Prepared Brotli/gzip variants for ${count} static JS/CSS files.`);
