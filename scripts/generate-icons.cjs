/* eslint-disable @typescript-eslint/no-require-imports -- Node asset build script. */
const sharp = require('sharp');
const fs = require('node:fs/promises');

async function main() {
  // Same monogram bounds as BrandMark; omit the wordmark at tab-icon sizes.
  const source = sharp('public/codastralabs-logo.jpeg').extract({ left: 340, top: 295, width: 555, height: 378 });
  const make = size => source.clone().resize(size, size, { fit: 'contain', background: '#f3f6fa' }).ensureAlpha().png().toBuffer();
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map(make));
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  images.forEach((data, i) => {
    const at = 6 + i * 16;
    header[at] = sizes[i]; header[at + 1] = sizes[i];
    header.writeUInt16LE(1, at + 4); header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(data.length, at + 8); header.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });
  await fs.writeFile('app/favicon.ico', Buffer.concat([header, ...images]));
  await fs.writeFile('app/icon.png', await make(192));
  await fs.writeFile('app/apple-icon.png', await make(180));
  console.log('Generated CodAstra tab and touch icons.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
