// This script uploads all files in nft_metadata (images + JSON) to NFT.Storage (IPFS) as a directory
// Usage: node upload_nft_to_nftstorage.js <YOUR_NFT_STORAGE_API_KEY>
// Compatible with Node.js ESM (type: module)

import fs from 'fs';
import path from 'path';
import { NFTStorage, File } from 'nft.storage';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFilesRecursive(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursive(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

async function main() {
  const apiKey = process.argv[2];
  if (!apiKey) {
    console.error('Usage: node upload_nft_to_nftstorage.js <YOUR_NFT_STORAGE_API_KEY>');
    process.exit(1);
  }
  const client = new NFTStorage({ token: apiKey });
  const baseDir = path.join(__dirname, 'nft_metadata');

  // Recursively collect all files (images + JSON)
  const files = getFilesRecursive(baseDir).map(filePath => {
    const content = fs.readFileSync(filePath);
    // Get the path relative to baseDir for correct directory structure on IPFS
    const relPath = path.relative(baseDir, filePath).replace(/\\/g, '/');
    return new File([content], relPath);
  });

  console.log(`Uploading ${files.length} files as a directory to NFT.Storage ...`);
  const dirCid = await client.storeDirectory(files);
  console.log(`Directory uploaded! Access it at: https://ipfs.io/ipfs/${dirCid}/`);
  files.forEach(f => {
    console.log(`${f.name}: https://ipfs.io/ipfs/${dirCid}/${f.name}`);
  });
  console.log('Upload complete!');
}

main().catch(console.error);
