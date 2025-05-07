const fs = require('fs');
const { Keypair } = require('@solana/web3.js');
const secret = JSON.parse(fs.readFileSync('mint_authority.json', 'utf8'));
const kp = Keypair.fromSecretKey(Uint8Array.from(secret));
console.log('Mint authority public address:', kp.publicKey.toBase58());
