const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const { createMint, createAssociatedTokenAccount, mintTo } = require('@solana/spl-token');
const { createMetadata, createMasterEdition } = require('@metaplex-foundation/js');

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const creatorWallet = new PublicKey('4GP4w3DzugTWHMGJCQ3U8DqWjVQHgXajS9Px83jeUppG');

async function mintNFT(metadataUri, walletAddress) {
    try {
        // Create mint
        const mint = await createMint(
            connection,
            creatorWallet,
            creatorWallet.publicKey,
            creatorWallet.publicKey,
            0
        );

        // Create token account
        const tokenAccount = await createAssociatedTokenAccount(
            connection,
            creatorWallet,
            mint,
            walletAddress
        );

        // Mint 1 token to the user's account
        await mintTo(
            connection,
            creatorWallet,
            mint,
            tokenAccount,
            creatorWallet,
            1
        );

        // Create metadata
        const metadata = await createMetadata(
            connection,
            creatorWallet,
            {
                name: "NFT Ball",
                symbol: "NFT",
                uri: metadataUri,
                sellerFeeBasisPoints: 500, // 5% royalty
                creators: [
                    {
                        address: creatorWallet.publicKey,
                        verified: true,
                        share: 100
                    }
                ]
            }
        );

        // Create master edition
        await createMasterEdition(
            connection,
            creatorWallet,
            {
                maxSupply: 1,
                mint
            }
        );

        return {
            success: true,
            mintAddress: mint.toString(),
            tokenAccount: tokenAccount.toString()
        };
    } catch (error) {
        console.error('Error minting NFT:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = { mintNFT };
