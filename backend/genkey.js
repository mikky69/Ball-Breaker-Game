const fs = require('fs');
const { Keypair } = require('@solana/web3.js');
const kp = Keypair.generate();
fs.writeFileSync('mint_authority.json', JSON.stringify(Array.from(kp.secretKey)));
console.log('Mint authority keypair saved to mint_authority.json');
