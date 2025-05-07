// Mint a Common Ball NFT to a specified wallet using the Helius NFT API (Node.js)
// Requires: npm install axios
// Usage: node mint-common-helius.js

const axios = require('axios');

// --- USER CONFIGURATION ---
const HELIUS_API_KEY = 'f2aca6d6-5b59-4fbd-82f0-1b72dbd670a2';
const RECEIVER_WALLET = '4GP4w3DzugTWHMGJCQ3U8DqWjVQHgXajS9Px83jeUppG';
const COMMON_METADATA_URI = 'https://aquamarine-impressive-galliform-138.mypinata.cloud/ipfs/bafkreihqorqpqcgw7eurhmeppalo3wbfwdzxyzw757tngtwqeudr7g5hvi?filename=common.json';
// --- END USER CONFIGURATION ---

async function mintCommonNFT() {
  const endpoint = `https://api.helius.xyz/v0/token-metadata/nft/compressed?api-key=${HELIUS_API_KEY}`;

  const nftData = {
    name: 'Ball Breaker Common',
    symbol: 'BALL',
    uri: COMMON_METADATA_URI,
    sellerFeeBasisPoints: 500,
    creators: [
      {
        address: RECEIVER_WALLET,
        share: 100,
        verified: true
      }
    ],
    isMutable: true,
    maxSupply: 0,
    owner: RECEIVER_WALLET
  };

  try {
    const response = await axios.post(endpoint, nftData);
    console.log('NFT minted successfully!');
    console.log('Mint address:', response.data.mint);
    console.log('Explorer link: https://solscan.io/token/' + response.data.mint);
  } catch (err) {
    console.error('Mint failed:', err.response?.data || err.message || err);
  }
}

mintCommonNFT();
