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
import { sendSol } from "./send-sol.ts";
 
// Run the tutorial.
tutorial();
 
async function tutorial() {

    // step 1 : getting the balance
    const client = await createClient();
    console.log(`\n👛 Client Wallet Address: ${client.wallet.address}`);

    // Get wallet balance
    const { value: walletBalance } = await client.rpc.getBalance(client.wallet.address).send();
    console.log(`💰 Wallet Balance: ${Number(walletBalance) / 1_000_000_000} SOL`);

    const account = address('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
    const { value: balance } = await client.rpc.getBalance(account).send();
    console.log(`Token Program Balance: ${Number(balance) / 1_000_000_000} SOL`);


    // step 2: Create a new wallet (no airdrop - we'll send SOL from main wallet)
    const wallet2 = await generateKeyPairSigner(); 
    console.log(`\n👛 Wallet 2 Address: ${wallet2.address}`);
    
    /* AIRDROP COMMENTED OUT - devnet has rate limits!
    const devnetAirdrop = airdropFactory({ rpc: client.rpc, rpcSubscriptions: client.rpcSubscriptions } as any);
    console.log(`🔑 Requesting devnet airdrop for wallet2...`);
    await devnetAirdrop({
      recipientAddress : wallet2.address,
      lamports : lamports(500_000_000n),
      commitment : 'confirmed',
    })
    */


    // step 3: Create a token mint! 🪙
    console.log(`\n📦 Creating a new token mint...`);
    const mint = await createMint(client, { decimals: 9 });
    console.log(`\n🎉 Token mint created successfully!`);
    console.log(`   Use this mint address to create token accounts and mint tokens.`);


    // step 4: Send SOL to wallet2 using sendSol function
    console.log(`\n💸 Sending 0.01 SOL to wallet2...`);
    await sendSol(client, 10_000_000n, wallet2.address);  // 0.01 SOL

    // Check wallet2 balance
    const {value : newBalance} = await client.rpc.getBalance(wallet2.address).send();
    console.log(`Wallet 2 Balance: ${Number(newBalance) / 1_000_000_000} SOL`);
}