// Blockchain interaction functions

// Connect to Solana devnet
const connection = new solanaWeb3.Connection(
    'https://api.devnet.solana.com',
    'confirmed'
);

// Program ID (replace with your actual program ID after deployment)
const PROGRAM_ID = 'YourProgramID11111111111111111111111111111';

// Import configuration
const config = require('./config');

// Use API URL from config
const API_URL = config.api.url;

// Log configuration (remove in production)
console.log('Blockchain initialized with API:', API_URL);

// Get current supply for a specific NFT type
async function getNFTSupply(rarity) {
    try {
        const response = await fetch(`${API_URL}/api/supply/${rarity}`);
        if (!response.ok) {
            throw new Error('Failed to fetch supply');
        }
        const data = await response.json();
        return data.supply;
    } catch (error) {
        console.error('Error getting NFT supply:', error);
        return 0;
    }
}

// Mint a new NFT
async function mintNFT(rarity, price) {
    try {
        const provider = window.phantom?.solana;
        if (!provider) {
            throw new Error('Phantom wallet not found');
        }

        // Connect to wallet
        const response = await provider.connect();
        const publicKey = response.publicKey.toString();

        // Call our backend API to handle the minting
        const mintResponse = await fetch(`${API_URL}/api/mint`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                walletAddress: publicKey,
                rarity: rarity,
                price: price
            })
        });

        if (!mintResponse.ok) {
            const error = await mintResponse.json();
            throw new Error(error.error || 'Failed to mint NFT');
        }

        const result = await mintResponse.json();
        return result;
    } catch (error) {
        console.error('Minting error:', error);
        throw error;
    }
}

// Update NFT supply in the UI
async function updateNFTSupply() {
    const rarities = ['ordinary', 'common', 'uncommon', 'rare', 'legendary'];
    
    for (const rarity of rarities) {
        try {
            const supply = await getNFTSupply(rarity);
            const supplyElement = document.querySelector(`.supply-${rarity}`);
            if (supplyElement) {
                const item = NFT_MARKET_ITEMS.find(i => i.rarity === rarity);
                if (item) {
                    item.totalSupply = supply;
                    supplyElement.textContent = `${item.maxSupply - supply} available (${item.maxSupply} total)`;
                }
            }
        } catch (error) {
            console.error(`Error updating supply for ${rarity}:`, error);
        }
    }
}

// Initialize blockchain functionality
async function initBlockchain() {
    try {
        // Check if Phantom is installed
        if (window.phantom?.solana?.isPhantom) {
            const provider = window.phantom.solana;
            
            // Connect to wallet
            await provider.connect();
            
            // Update UI based on connection status
            const walletAddress = provider.publicKey?.toString();
            if (walletAddress) {
                // Update wallet address in UI
                const walletElement = document.getElementById('walletAddress');
                if (walletElement) {
                    walletElement.textContent = `${walletAddress.substring(0, 4)}...${walletAddress.slice(-4)}`;
                }
                
                // Update NFT supplies
                await updateNFTSupply();
            }
        }
    } catch (error) {
        console.error('Error initializing blockchain:', error);
    }
}

// Call init when the page loads
window.addEventListener('load', initBlockchain);
