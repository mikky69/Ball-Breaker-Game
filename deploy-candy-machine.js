import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createCandyMachine, insertItems } from '@metaplex-foundation/umi-candy-machine';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

const RPC_ENDPOINT = 'https://api.devnet.solana.com'; // Use 'https://api.mainnet-beta.solana.com' for mainnet
const ITEMS = [
  {
    name: "Common Ball",
    uri: "https://aquamarine-impressive-galliform-138.mypinata.cloud/ipfs/bafkreihqorqpqcgw7eurhmeppalo3wbfwdzxyzw757tngtwqeudr7g5hvi?filename=common.json"
  },
  {
    name: "Uncommon Ball",
    uri: "https://aquamarine-impressive-galliform-138.mypinata.cloud/ipfs/bafkreih2ghzax5merwgumhcq6sqsoeuafir23etjhpjh5jfzvbol6prnym?filename=uncommon.json"
  },
  {
    name: "Rare Ball",
    uri: "https://aquamarine-impressive-galliform-138.mypinata.cloud/ipfs/bafkreifiuw72k6unnvz6srbeq5ykalesklljyuggszay36dmihiexuzrnu?filename=rare.json"
  },
  {
    name: "Legendary Ball",
    uri: "https://aquamarine-impressive-galliform-138.mypinata.cloud/ipfs/bafkreib54lr3sc6lakxbsrumux7mdigekkraretfhkuvf3zlravbpyioaq?filename=legendary.json"
  }
];

async function main() {
  // Connect to Phantom
  const phantom = new PhantomWalletAdapter();
  await phantom.connect();

  // Create Umi instance with Phantom
  const umi = createUmi(RPC_ENDPOINT).use(phantom);

  // Create the Candy Machine
  const { candyMachine } = await createCandyMachine(umi, {
    itemsAvailable: ITEMS.length,
    sellerFeeBasisPoints: 500, // 5% royalties
    symbol: "BALL",
    // Add more config as needed (price, goLiveDate, etc.)
  });

  // Insert your NFT items (metadata links)
  await insertItems(umi, {
    candyMachine: candyMachine.publicKey,
    items: ITEMS
  });

  console.log("Candy Machine deployed! Address:", candyMachine.publicKey.toString());
}

main().catch(console.error);
