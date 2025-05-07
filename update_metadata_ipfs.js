// Script to update the "image" field in all NFT metadata JSON files to use the correct IPFS URL
// Usage: node update_metadata_ipfs.js

import fs from 'fs';
import path from 'path';

const CID = 'bafybeieknd7xwaakbilcneetzv2rmbzjygzohywgtbgp5pmmmkbmfccro4';
const baseDir = path.join(process.cwd(), 'nft_metadata');
const imageDir = path.join(baseDir, 'images');

const imageFiles = fs.readdirSync(imageDir);
const jsonFiles = fs.readdirSync(baseDir).filter(f => f.endsWith('.json'));

for (const jsonFile of jsonFiles) {
  const jsonPath = path.join(baseDir, jsonFile);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  // Derive image file name from the JSON (assumes 'image' field is present and matches the file name)
  let imageFile = data.image || '';
  if (!imageFile.endsWith('.svg')) imageFile = imageFile.replace('.png', '.svg'); // fallback for .png
  if (!imageFiles.includes(imageFile)) {
    // Try to match by rarity in file name
    const rarity = jsonFile.replace('.json', '');
    imageFile = imageFiles.find(f => f.startsWith(rarity));
  }
  if (imageFile) {
    data.image = `ipfs://${CID}/images/${imageFile}`;
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log(`Updated ${jsonFile}: ${data.image}`);
  } else {
    console.warn(`No matching image found for ${jsonFile}`);
  }
}
console.log('All metadata files updated!');
