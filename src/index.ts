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
 
// Run the tutorial.
tutorial();
 
async function tutorial() {

    // step 1 : getting the balance
    const client = await createClient(); // create the client
    const account = address('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'); // create the address
    const { value: balance } = await client.rpc.getBalance(account).send(); // get the balance
    console.log(`Balance: ${balance} lamports.`); // print the balance
    console.log(`Balance: ${Number(balance) / 1_000_000_000} SOL`);


    // getting an airdrop on local validator
    const wallet2 = await generateKeyPairSigner(); 
    console.log(`\nWallet 2 Address: ${wallet2.address}`);
    
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


    
}