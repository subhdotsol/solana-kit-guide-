import { airdropFactory, createSolanaRpc, createSolanaRpcSubscriptions, generateKeyPairSigner, lamports } from '@solana/kit';

export type Client = {
    rpc: ReturnType<typeof createSolanaRpc>;
    rpcSubscriptions: ReturnType<typeof createSolanaRpcSubscriptions>;
    wallet: Awaited<ReturnType<typeof generateKeyPairSigner>>;
};

let client: Client | undefined;
export async function createClient(): Promise<Client> {
    if (!client) {
        const rpc = createSolanaRpc('http://127.0.0.1:8899');
        const rpcSubscriptions = createSolanaRpcSubscriptions('ws://127.0.0.1:8900');
        const airdrop = airdropFactory({ rpc, rpcSubscriptions } as any); 


        const wallet = await generateKeyPairSigner();
        await airdrop({
            recipientAddress : wallet.address,
            lamports : lamports(1_000_000_000n),
            commitment : 'confirmed',
        })
        // store the client 
        client = {
            rpc,
            rpcSubscriptions,
            wallet,
        };
    }
    return client;
}