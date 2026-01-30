// Program for sending SOL to someone 

import { 
    createTransactionMessage, 
    setTransactionMessageFeePayer,
    setTransactionMessageLifetimeUsingBlockhash,
    appendTransactionMessageInstructions,
    signTransactionMessageWithSigners,
    getSignatureFromTransaction,
    sendAndConfirmTransactionFactory,
    address,
    lamports
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import { createClient, type Client } from "./client.ts";

export async function sendSol(
    client: Client,
    amount: bigint,  // amount in lamports
    to: string       // recipient address
) {
    // Step 1: Get latest blockhash for transaction lifetime
    const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send();

    // Step 2: Build the transfer instruction
    const transferInstruction = getTransferSolInstruction({
        source: client.wallet,           // Who is sending (needs to sign)
        destination: address(to),        // Who receives
        amount: lamports(amount),        // How much (in lamports)
    });

    // Step 3: Build the transaction message
    const transactionMessage = appendTransactionMessageInstructions(
        [transferInstruction],
        setTransactionMessageLifetimeUsingBlockhash(
            latestBlockhash,
            setTransactionMessageFeePayer(
                client.wallet.address,
                createTransactionMessage({ version: 0 })
            )
        )
    );

    // Step 4: Sign the transaction
    const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);

    // Step 5: Send and confirm
    const sendAndConfirm = sendAndConfirmTransactionFactory({ 
        rpc: client.rpc, 
        rpcSubscriptions: client.rpcSubscriptions 
    } as any);
    
    await sendAndConfirm(signedTransaction as any, { commitment: 'confirmed' });

    // Get the signature
    const signature = getSignatureFromTransaction(signedTransaction);
    console.log(`✅ Sent ${Number(amount) / 1_000_000_000} SOL to ${to}`);
    console.log(`📝 Signature: ${signature}`);

    return signature;
}

// Helper function to send SOL in a simpler way
export async function sendSolSimple(amountInSol: number, to: string) {
    const client = await createClient();
    const amountInLamports = BigInt(amountInSol * 1_000_000_000);
    return sendSol(client, amountInLamports, to);
}