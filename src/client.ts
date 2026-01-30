import { createSolanaRpc, createSolanaRpcSubscriptions, createKeyPairSignerFromBytes, generateKeyPairSigner, airdropFactory, lamports } from '@solana/kit';
import { readFileSync } from 'fs';
import { homedir } from 'os';

export type Client = {
    rpc: ReturnType<typeof createSolanaRpc>;
    rpcSubscriptions: ReturnType<typeof createSolanaRpcSubscriptions>;
    wallet: Awaited<ReturnType<typeof createKeyPairSignerFromBytes>>;
    testWallet: Awaited<ReturnType<typeof generateKeyPairSigner>>;
};

let client: Client | undefined;
export async function createClient(): Promise<Client> {
    if (!client) {
        // 🌐 Using DEVNET
        const rpc = createSolanaRpc('https://api.devnet.solana.com');
        const rpcSubscriptions = createSolanaRpcSubscriptions('wss://api.devnet.solana.com');
        const airdrop = airdropFactory({ rpc, rpcSubscriptions } as any); 

        // Load existing wallet from Solana CLI config (already has funds!)
        const keypairPath = `${homedir()}/.config/solana/id.json`;
        const keypairBytes = new Uint8Array(JSON.parse(readFileSync(keypairPath, 'utf-8')));
        const wallet = await createKeyPairSignerFromBytes(keypairBytes);
        
        console.log(`🔑 Loaded wallet from ${keypairPath}`);

        // generating a extra wallet for testing 
        const testWallet = await generateKeyPairSigner();
        await airdrop({
            recipientAddress : testWallet.address,
            lamports : lamports(500_000_000n),
            commitment : 'confirmed',
        })

        client = {
            rpc,
            rpcSubscriptions,
            wallet,
            testWallet,
        };
    }
    return client;
}