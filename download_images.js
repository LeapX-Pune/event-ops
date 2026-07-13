const fs = require('fs');
const https = require('https');
const path = require('path');

const eventsFile = 'js/data/events.js';
const imagesDir = 'assets/images/events';

if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir, { recursive: true });
}

let content = fs.readFileSync(eventsFile, 'utf8');

// Find all image URLs that contain pollinations.ai
const regex = /image:\s*['"](https:\/\/image\.pollinations\.ai[^'"]+)['"]/g;
let match;
let downloads = [];

while ((match = regex.exec(content)) !== null) {
  const url = match[1];
  const fullTextBefore = content.substring(Math.max(0, match.index - 300), match.index);
  const idMatch = fullTextBefore.match(/id:\s*['"](evt_\d+)['"]/);
  if (idMatch) {
    downloads.push({ url, id: idMatch[1] });
  }
}

async function downloadAll() {
  console.log(`Starting download of ${downloads.length} images...`);
  
  for (const { url, id } of downloads) {
    const filename = `${id}.jpg`;
    const filepath = path.join(imagesDir, filename);
    
    // Download image
    await new Promise((resolve, reject) => {
      console.log(`Downloading ${url} -> ${filepath}`);
      const file = fs.createWriteStream(filepath);
      https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(filepath, () => {});
        console.error(`Error downloading ${id}: ${err.message}`);
        resolve(); // continue anyway
      });
    });
    
    // Replace URL in content
    content = content.replace(url, `assets/images/events/${filename}`);
  }
  
  fs.writeFileSync(eventsFile, content);
  console.log('Finished updating events.js with local image paths.');
}

downloadAll();
