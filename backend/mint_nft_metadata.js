// Pure Solana NFT mint with metadata using @solana/web3.js only
// This function is suitable for backend usage (Node.js, Express)
// Requires: @solana/web3.js, SPL Token program, Token Metadata program

const { PublicKey, Keypair, SystemProgram, Transaction, Connection, sendAndConfirmTransaction } = require('@solana/web3.js');
const splToken = require('@solana/spl-token');

// Token Metadata Program address
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

function getMetadataPDA(mint) {
    return PublicKey.findProgramAddressSync([
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
    ], TOKEN_METADATA_PROGRAM_ID)[0];
}

async function mintNFTWithMetadata({
    connection,
    payer,
    userPublicKey,
    metadataUri,
    name,
    symbol,
    sellerFeeBasisPoints
}) {
    // 1. Create new mint account (NFT)
    const mint = await splToken.createMint(
        connection,
        payer,
        payer.publicKey,
        null,
        0 // decimals
    );

    // 2. Create associated token account for user
    const userTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        userPublicKey
    );

    // 3. Mint 1 token (NFT) to user
    await splToken.mintTo(
        connection,
        payer,
        mint,
        userTokenAccount.address,
        payer.publicKey,
        1
    );

    // 4. Create Metadata account (Token Metadata program)
    const metadataPDA = getMetadataPDA(mint);
    const txn = new Transaction();
    const metadataData = {
        name: name,
        symbol: symbol,
        uri: metadataUri,
        sellerFeeBasisPoints: sellerFeeBasisPoints,
        creators: null, // You can add creators if needed
        collection: null,
        uses: null
    };

    // You need to use a helper library or serialize the instruction data for Metadata manually.
    // The Metaplex JS SDK usually does this, but here you would need to build the instruction manually
    // or use a helper like @metaplex-foundation/mpl-token-metadata (if available on npm).
    // For now, we return the mint address and leave metadata creation as a TODO.

    // TODO: Add metadata creation instruction here if you add mpl-token-metadata
    // txn.add(createCreateMetadataAccountV3Instruction(...))

    // await sendAndConfirmTransaction(connection, txn, [payer]);

    return mint.toBase58();
}

module.exports = { mintNFTWithMetadata };
