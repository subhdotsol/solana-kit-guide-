import {
  airdropFactory,
  assertIsProgramDerivedAddress,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  generateKeyPairSigner,
  lamports,
  sendAndConfirmTransactionFactory,
} from "@solana/kit";

const rpc = createSolanaRpc("https://api.devnet.solana.com");
const rpcSubscriptions = createSolanaRpcSubscriptions(
  "wss://api.devnet.solana.com"
);
const airdrop = airdropFactory({rpc, rpcSubscriptions});


const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
  rpc,
  rpcSubscriptions,
});


import { address } from '@solana/kit';
import { createClient } from './client.ts';
import { createMint } from './create-mint.ts';
 
// Run the tutorial.
tutorial();
 
async function tutorial() {

    // step 1 : getting the balance
    const client = await createClient(); // create the client
    console.log(`\n👛 Client Wallet Address: ${client.wallet.address}`);

    const account = address('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'); // create the address
    const { value: balance } = await client.rpc.getBalance(account).send(); // get the balance
    console.log(`Token Program Balance: ${balance} lamports.`);
    console.log(`Token Program Balance: ${Number(balance) / 1_000_000_000} SOL`);


    // step 2: getting an airdrop on local validator
    const wallet2 = await generateKeyPairSigner(); 
    console.log(`\n👛 Wallet 2 Address: ${wallet2.address}`);
    
    // Use local airdrop via client's rpc
    const localAirdrop = airdropFactory({ rpc: client.rpc, rpcSubscriptions: client.rpcSubscriptions } as any);
    await localAirdrop({
      recipientAddress : wallet2.address,
      lamports : lamports(1_000_000_000n),
      commitment : 'confirmed',
    })

    const {value : newBalance} = await client.rpc.getBalance(wallet2.address).send();
    console.log(`Wallet 2 Balance: ${newBalance} lamports.`);
    console.log(`Wallet 2 Balance: ${Number(newBalance) / 1_000_000_000} SOL`);


    // step 3: Create a token mint! 🪙
    console.log(`\n📦 Creating a new token mint...`);
    const mint = await createMint(client, { decimals: 9 });
    console.log(`\n🎉 Token mint created successfully!`);
    console.log(`   Use this mint address to create token accounts and mint tokens.`);
}