const express = require('express');
const cors = require('cors');
const { Connection, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const { createMint, createAssociatedTokenAccount, mintTo } = require('@solana/spl-token');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Solana connection
const connection = new Connection('https://api.devnet.solana.com');

// Your devnet wallet address for receiving SOL
const adminWallet = new PublicKey('4GP4w3DzugTWHMGJCQ3U8DqWjVQHgXajS9Px83jeUppG');

app.post('/api/mint', async (req, res) => {
    try {
        const { wallet, txSignature, nftType, metadata } = req.body;
        
        // Validate inputs
        if (!wallet || !txSignature || !nftType || !metadata) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Verify transaction
        const signatureStatus = await connection.getSignatureStatus(txSignature);
        if (!signatureStatus || !signatureStatus.value?.confirmed) {
            return res.status(400).json({ error: 'Transaction not confirmed' });
        }

        // Create mint account
        const mint = await createMint(
            connection,
            adminWallet, // Mint authority
            adminWallet, // Freeze authority
            adminWallet, // Owner
            0 // Decimals
        );

        // Create associated token account
        const tokenAccount = await createAssociatedTokenAccount(
            connection,
            adminWallet, // Payer
            mint, // Mint
            new PublicKey(wallet) // Owner
        );

        // Mint tokens
        await mintTo(
            connection,
            adminWallet, // Payer
            mint, // Mint
            tokenAccount, // Destination
            adminWallet, // Mint authority
            1 // Amount
        );

        // TODO: Store metadata on IPFS or other storage solution
        // This is a simplified example - in production you would:
        // 1. Store the metadata on IPFS
        // 2. Create a metadata account on Solana
        // 3. Link the metadata to the mint account

        res.json({
            success: true,
            mint: mint.toString(),
            tokenAccount: tokenAccount.toString()
        });
    } catch (error) {
        console.error('Minting error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
