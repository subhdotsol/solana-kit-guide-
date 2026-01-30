import { getCreateAccountInstruction } from "@solana-program/system";
import type { Client } from "./client.ts";
import { getInitializeMintInstruction, getMintSize, TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import { generateKeyPairSigner } from "@solana/kit";

export async function createMint(client : Client , options : {decimals?: number} = {}){

    // prepare inputs 
    const mintSize = getMintSize(); 
    const [mint , mintRent] = await Promise.all([
        generateKeyPairSigner(),
        client.rpc.getMinimumBalanceForRentExemption(BigInt(mintSize)).send(),
    ])

    // build instruction 
    const createAccountIx = getCreateAccountInstruction({
        payer : client.wallet , 
        newAccount : mint , 
        space : mintSize , 
        lamports : mintRent , 
        programAddress : TOKEN_PROGRAM_ADDRESS
    });

    const initializeMintIx = getInitializeMintInstruction({
        mint : mint.address , 
        decimals : options.decimals ?? 9 , 
        mintAuthority : client.wallet.address , 
        freezeAuthority : client.wallet.address , 
    });
}