import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js';
const { mintNFTWithMetadata } = require('./mint_nft_metadata');

const app = express();
app.use(express.json());
app.use(cors());

// Load mint authority
const secretKeyPath = process.env.MINT_AUTHORITY_KEYPAIR || 'mint_authority.json';
const secret = JSON.parse(fs.readFileSync(secretKeyPath, 'utf8'));
const mintAuthority = Keypair.fromSecretKey(Uint8Array.from(secret));

const connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');

app.post('/api/mint', async (req, res) => {
    try {
        const { wallet, txSignature, nftType } = req.body;
        if (!wallet || !txSignature || !nftType) return res.status(400).json({ error: 'wallet, txSignature, and nftType required' });
        // Load metadata from file
        const metaPath = `./nft_metadata/${nftType}.json`;
        if (!fs.existsSync(metaPath)) return res.status(400).json({ error: 'NFT metadata not found' });
        const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

        // 1. Verify payment transaction
        const tx = await connection.getParsedTransaction(txSignature, { commitment: 'confirmed' });
        if (!tx) return res.status(400).json({ error: 'Transaction not found' });
        // Find payment to creator
        const creatorWallet = mintAuthority.publicKey.toBase58();
        let paid = false;
        let expectedAmount = 0.1 * 1e9; // 0.1 SOL (change as needed)
        if (tx.meta && tx.transaction && tx.transaction.message && tx.transaction.message.accountKeys) {
            const postBalances = tx.meta.postBalances;
            const preBalances = tx.meta.preBalances;
            const keys = tx.transaction.message.accountKeys;
            for (let i = 0; i < keys.length; i++) {
                if (keys[i].pubkey.toBase58() === creatorWallet) {
                    if (postBalances[i] - preBalances[i] >= expectedAmount) paid = true;
                }
            }
        }
        if (!paid) return res.status(400).json({ error: 'Payment not found or insufficient' });

        // 2. Mint NFT with metadata
        const mint = await mintNFTWithMetadata({
            connection,
            payer: mintAuthority,
            userPublicKey: new PublicKey(wallet),
            metadataUri: metadata.image, // you may want to use a separate metadata URI
            name: metadata.name,
            symbol: metadata.symbol,
            sellerFeeBasisPoints: metadata.seller_fee_basis_points || 0
        });
        res.json({ success: true, mint });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/owned/:wallet', (req, res) => {
    const { wallet } = req.params;
    res.json({}); // purchaseLog[wallet] || []
});

app.listen(process.env.PORT, () => {
    console.log(`NFT backend listening on port ${process.env.PORT}`);
});
