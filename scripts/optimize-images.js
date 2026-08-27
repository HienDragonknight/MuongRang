const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processDir(dirPath, maxDim, quality) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    if (file.isDirectory()) {
      await processDir(fullPath, maxDim, quality);
    } else if (/\.(jpe?g|png)$/i.test(file.name)) {
      try {
        const metadata = await sharp(fullPath).metadata();
        if (metadata.width > maxDim || metadata.height > maxDim) {
          const tempPath = fullPath + '.tmp';
          await sharp(fullPath)
            .resize({
              width: maxDim,
              height: maxDim,
              fit: 'inside',
              withoutEnlargement: true
            })
            .jpeg({ quality: quality, mozjpeg: true })
            .toFile(tempPath);

          fs.unlinkSync(fullPath);
          fs.renameSync(tempPath, fullPath);
          console.log(`Optimized: ${file.name} (${metadata.width}x${metadata.height} -> max ${maxDim}px)`);
        }
      } catch (err) {
        console.error(`Error processing ${file.name}:`, err.message);
      }
    }
  }
}

async function run() {
  console.log('Optimizing BTC avatar images...');
  await processDir(path.join(__dirname, '../public/resources/btc_images'), 600, 85);

  console.log('Optimizing Trien Lam images...');
  await processDir(path.join(__dirname, '../public/resources/trienlam_images'), 1200, 82);

  console.log('Optimizing Talkshow images...');
  await processDir(path.join(__dirname, '../public/resources/talkshow_images'), 1200, 82);

  console.log('Done optimizing images!');
}

run();
