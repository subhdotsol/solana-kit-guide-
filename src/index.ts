import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  sendAndConfirmTransactionFactory,
} from "@solana/kit";

const rpc = createSolanaRpc("https://api.devnet.solana.com");
const rpcSubscriptions = createSolanaRpcSubscriptions(
  "wss://api.devnet.solana.com"
);
const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
  rpc,
  rpcSubscriptions,
});


import { address } from '@solana/kit';
import { createClient } from './client.ts';
 
// Run the tutorial.
tutorial();
 
async function tutorial() {
    const client = createClient(); // create the client
    const account = address('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'); // create the address
    const { value: balance } = await client.rpc.getBalance(account).send(); // get the balance
    console.log(`Balance: ${balance} lamports.`); // print the balance
    console.log(`Balance: ${Number(balance) / 1_000_000_000} SOL`);
}