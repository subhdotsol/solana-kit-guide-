import { getCreateAccountInstruction } from "@solana-program/system";
import type { Client } from "./client.ts";
import { getInitializeMintInstruction, getMintSize, TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import { 
    generateKeyPairSigner, 
    createTransactionMessage, 
    setTransactionMessageFeePayer, 
    setTransactionMessageLifetimeUsingBlockhash, 
    appendTransactionMessageInstructions,
    signTransactionMessageWithSigners,
    getSignatureFromTransaction,
    sendAndConfirmTransactionFactory
} from "@solana/kit";

export async function createMint(client: Client, options: { decimals?: number } = {}) {

    // Step 1: Prepare inputs 
    const mintSize = getMintSize();
    const [mint, mintRent, { value: latestBlockhash }] = await Promise.all([
        generateKeyPairSigner(),
        client.rpc.getMinimumBalanceForRentExemption(BigInt(mintSize)).send(),
        client.rpc.getLatestBlockhash().send(),  // Need this for transaction lifetime
    ]);

    // Step 2: Build instructions
    const createAccountIx = getCreateAccountInstruction({
        payer: client.wallet,
        newAccount: mint,
        space: mintSize,
        lamports: mintRent,
        programAddress: TOKEN_PROGRAM_ADDRESS
    });

    const initializeMintIx = getInitializeMintInstruction({
        mint: mint.address,
        decimals: options.decimals ?? 9,
        mintAuthority: client.wallet.address,
        freezeAuthority: client.wallet.address,
    });

    // Step 3: Build the transaction message
    const transactionMessage = await appendTransactionMessageInstructions(
        [createAccountIx, initializeMintIx],
        setTransactionMessageLifetimeUsingBlockhash(
            latestBlockhash,
            setTransactionMessageFeePayer(
                client.wallet.address,
                createTransactionMessage({ version: 0 })
            )
        )
    );

    // Step 4: Sign the transaction (both wallet and mint keypair need to sign)
    const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);

    // Step 5: Send and confirm the transaction
    const sendAndConfirm = sendAndConfirmTransactionFactory({ 
        rpc: client.rpc, 
        rpcSubscriptions: client.rpcSubscriptions 
    } as any);
    
    await sendAndConfirm(signedTransaction as any, { commitment: 'confirmed' });

    // Step 6: Get and log the signature
    const signature = getSignatureFromTransaction(signedTransaction);
    console.log(`✅ Mint created! Signature: ${signature}`);
    console.log(`🪙 Mint Address: ${mint.address}`);

    // Return the mint so caller can use it
    return mint;
}