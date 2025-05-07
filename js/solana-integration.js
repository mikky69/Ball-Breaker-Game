// NFT metadata structure (legacy, still used for default values)
const NFT_BALLS = {
    common: {
        name: 'Common Ball',
        pointMultiplier: 1.2,
        price: 0.1, // SOL
        color: '#4CAF50'
    },
    uncommon: {
        name: 'Uncommon Ball',
        pointMultiplier: 1.5,
        price: 0.2,
        color: '#2196F3'
    },
    rare: {
        name: 'Rare Ball',
        pointMultiplier: 2.0,
        price: 0.5,
        color: '#9C27B0'
    },
    legendary: {
        name: 'Legendary Ball',
        pointMultiplier: 3.0,
        price: 1.0,
        color: '#FFD700'
    }
};

// --- BEGIN: Metaplex Integration ---
// import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
// import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

// const CREATOR_ADDRESS = 'HXK1mAT99M7enBf2QQjJBpoFcPziRGxmfQxqJhzFzuNe';
// const SOLANA_RPC = clusterApiUrl('mainnet-beta');
// const connection = new Connection(SOLANA_RPC);
// let metaplex = null;

// function getMetaplex(wallet) {
//     if (!metaplex) {
//         metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
//     }
//     return metaplex;
// }

async function fetchUserNFTBalls(wallet) {
    if (!wallet || !wallet.publicKey) return [];
    // const m = getMetaplex(wallet);
    // Fetch all NFTs owned by the wallet
    // const nfts = await m.nfts().findAllByOwner({ owner: wallet.publicKey });
    // Filter to only NFTs created by your creator address
    // const myNfts = nfts.filter(nft => nft.creators && nft.creators.some(c => c.address.toBase58() === CREATOR_ADDRESS));
    // Load metadata from IPFS
    const balls = [];
    // for (const nft of myNfts) {
    //     try {
    //         const meta = await fetch(nft.uri).then(res => res.json());
    //         balls.push({
    //             mint: nft.mintAddress.toBase58(),
    //             name: meta.name,
    //             image: meta.image,
    //             multiplier: meta.attributes?.find(a => a.trait_type === 'Multiplier')?.value || 1,
    //             color: meta.attributes?.find(a => a.trait_type === 'Color')?.value || '#fff',
    //             rarity: meta.attributes?.find(a => a.trait_type === 'Rarity')?.value?.toLowerCase() || 'common',
    //             raw: meta
    //         });
    //     } catch (e) {
    //         console.warn('Failed to load NFT metadata', nft, e);
    //     }
    // }
    return balls;
}
// --- END: Metaplex Integration ---

class SolanaGameManager {
    constructor() {
        this.wallet = null;
        this.playerNFTs = new Set();
        this.currentBall = 'common';
        this.nftBalls = [];
    }

    async connectPhantomWallet() {
        try {
            console.log('Attempting to connect Phantom wallet...');
            if (!window.solana) {
                throw new Error('Phantom wallet is not installed. Please install it from phantom.app');
            }
            if (!window.solana.isPhantom) {
                throw new Error('Please install Phantom wallet from phantom.app');
            }
            try {
                const resp = await window.solana.connect();
                console.log('Connection response:', resp);
                if (resp.publicKey) {
                    this.wallet = window.solana;
                    // Fetch and cache NFT balls
                    this.nftBalls = await fetchUserNFTBalls(this.wallet);
                    this.playerNFTs = new Set(this.nftBalls.map(b => b.rarity));
                    return {
                        success: true,
                        address: resp.publicKey.toString(),
                        nftBalls: this.nftBalls
                    };
                } else {
                    throw new Error('No public key received from wallet');
                }
            } catch (err) {
                console.error('Connection error:', err);
                if (err.code === 4001) {
                    throw new Error('Please accept the connection request in your wallet');
                }
                throw err;
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            return {
                success: false,
                error: error.message || 'Unknown wallet connection error'
            };
        }
    }

    async refreshNFTBalls() {
        if (this.wallet && this.wallet.publicKey) {
            this.nftBalls = await fetchUserNFTBalls(this.wallet);
            this.playerNFTs = new Set(this.nftBalls.map(b => b.rarity));
        }
    }

    async disconnectWallet() {
        try {
            if (window.solana && window.solana.disconnect) {
                await window.solana.disconnect();
            }
            this.wallet = null;
            this.nftBalls = [];
            this.playerNFTs = new Set();
        } catch (error) {
            console.error('Error disconnecting wallet:', error);
            throw error;
        }
    }

    getPointMultiplier() {
        // Use NFT multiplier if selected ball is owned
        const nft = this.nftBalls.find(b => b.rarity === this.currentBall);
        return nft ? Number(nft.multiplier) : NFT_BALLS[this.currentBall].pointMultiplier;
    }

    getBallColor() {
        const nft = this.nftBalls.find(b => b.rarity === this.currentBall);
        return nft ? nft.color : NFT_BALLS[this.currentBall].color;
    }

    getAvailableBalls() {
        return this.nftBalls.map(b => b.rarity);
    }

    selectBall(rarity) {
        if (!this.playerNFTs.has(rarity)) {
            throw new Error('Ball not owned');
        }
        this.currentBall = rarity;
        return this.nftBalls.find(b => b.rarity === rarity) || NFT_BALLS[rarity];
    }

    isWalletConnected() {
        return this.wallet !== null;
    }
}

export const gameManager = new SolanaGameManager();
export { NFT_BALLS };
