const express = require('express');
const cors = require('cors');
const { Connection, PublicKey, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Solana devnet
console.log('Connecting to Solana devnet...');
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Verify Solana connection
async function verifySolanaConnection() {
    try {
        const version = await connection.getVersion();
        console.log('Successfully connected to Solana devnet');
        console.log('Solana node version:', version['solana-core']);
        return true;
    } catch (error) {
        console.error('Failed to connect to Solana devnet:', error);
        return false;
    }
}

// Replace with your program ID after deployment
const PROGRAM_ID = 'YourProgramID11111111111111111111111111111';

// Verify connection on startup
verifySolanaConnection().then(isConnected => {
    if (!isConnected) {
        console.warn('Warning: Could not connect to Solana devnet. Some features may not work.');
    }
});

// Endpoint to get NFT supply
app.get('/api/supply/:rarity', async (req, res) => {
    try {
        const { rarity } = req.params;
        // In a real app, you would query your program for the current supply
        // For now, we'll return a mock response
        const supply = {
            ordinary: 0,
            common: 0,
            uncommon: 0,
            rare: 0,
            legendary: 0
        };
        
        res.json({ supply: supply[rarity] || 0 });
    } catch (error) {
        console.error('Error getting supply:', error);
        res.status(500).json({ error: 'Failed to get supply' });
    }
});

// Endpoint to mint NFT
app.post('/api/mint', async (req, res) => {
    try {
        const { walletAddress, rarity } = req.body;
        
        if (!walletAddress || !rarity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // In a real app, you would:
        // 1. Verify the payment
        // 2. Call your Solana program to mint the NFT
        // 3. Update the supply
        
        // For now, we'll just return a success response
        res.json({ 
            success: true,
            message: 'NFT minted successfully',
            rarity,
            walletAddress
        });
    } catch (error) {
        console.error('Minting error:', error);
        res.status(500).json({ error: 'Failed to mint NFT' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
