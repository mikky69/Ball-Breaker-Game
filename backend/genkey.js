const fs = require('fs');
const { Keypair } = require('@solana/web3.js');

const kp = Keypair.generate();
const secretKeyPath = process.env.MINT_AUTHORITY_KEYPAIR || 'mint_authority.json';
fs.writeFileSync(secretKeyPath, JSON.stringify(Array.from(kp.secretKey)));

console.log('Mint authority key pair generated successfully. Please move the file to a secure location and set the MINT_AUTHORITY_KEYPAIR environment variable.');
console.log(`Mint authority keypair saved to ${secretKeyPath}`);
