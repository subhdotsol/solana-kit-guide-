# Solana Kit Tutorial 🚀

A hands-on tutorial for learning `@solana/kit` - the modern TypeScript SDK for Solana.

## 📦 Project Structure

```
solana-kit/
├── src/
│   ├── index.ts     # Main tutorial code
│   └── client.ts    # Reusable client setup
├── learnings.md     # Beginner-friendly explanations
└── package.json
```

---

## 🛠️ Setup

```bash
# Install dependencies
bun install

# Start the local validator (in one terminal)
bun run validator

# Run the code (in another terminal)
bun start
```

---

## 📚 What We Built

### 1. Client Pattern (`client.ts`)

A reusable client that bundles:
- **RPC** - HTTP connection to Solana
- **RPC Subscriptions** - WebSocket for real-time updates
- **Wallet** - Pre-funded keypair for testing

```typescript
const client = await createClient();
```

### 2. Tutorial Code (`index.ts`)

- Get account balance
- Generate new wallets
- Airdrop SOL to wallets

---

## 🐛 Errors We Faced & How We Fixed Them

### Error 1: `'Rpc' is not exported from '@solana/kit'`

**What happened:**
```typescript
import { Rpc, TransactionSigner, MessageSigner } from '@solana/kit';
// ❌ SyntaxError: not exported
```

**Why:** These types don't exist as direct exports in `@solana/kit`.

**Fix:** Use TypeScript's `ReturnType` and `Awaited` to infer types:
```typescript
type Client = {
    rpc: ReturnType<typeof createSolanaRpc>;
    wallet: Awaited<ReturnType<typeof generateKeyPairSigner>>;
};
```

---

### Error 2: `createClient() is a Promise`

**What happened:**
```typescript
const client = createClient();
client.rpc.getBalance(...)  // ❌ undefined is not an object
```

**Why:** `createClient()` is now `async` (returns a Promise), but we weren't `await`ing it.

**Fix:**
```typescript
const client = await createClient();  // ✅ Add await
```

---

### Error 3: `WebSocket failed to connect`

**What happened:**
```
SolanaError: WebSocket failed to connect
'wss://127.0.0.1:8899/' failed: TLS handshake failed
```

**Why:** Wrong WebSocket URL for local validator:
- Used `wss://` (secure) instead of `ws://` (plain)
- Used port `8899` instead of `8900`

**Fix:**
```typescript
// ❌ Wrong
createSolanaRpcSubscriptions('wss://127.0.0.1:8899')

// ✅ Correct
createSolanaRpcSubscriptions('ws://127.0.0.1:8900')
```

**Local validator ports:**
| Service | Port | Protocol |
|---------|------|----------|
| RPC (HTTP) | 8899 | `http://` |
| WebSocket | 8900 | `ws://` |

---

### Error 4: `429 Too Many Requests`

**What happened:**
```
SolanaError: HTTP error (429): Too Many Requests
```

**Why:** We were calling devnet airdrop (rate-limited) while using local validator.

**Fix:** Use the local airdrop instead:
```typescript
// Create airdrop using local client's connection
const localAirdrop = airdropFactory({ 
    rpc: client.rpc, 
    rpcSubscriptions: client.rpcSubscriptions 
} as any);
```

---

### Error 5: TypeScript cluster type mismatch

**What happened:**
```
No overload matches this call.
Type '"devnet"' is not assignable to type '"testnet"'
```

**Why:** `@solana/kit` uses strict cluster-aware types. Local URLs can't be inferred.

**Fix:** Cast as `any` to bypass strict typing:
```typescript
airdropFactory({ rpc, rpcSubscriptions } as any);
```

> ⚠️ This is a known workaround for localhost development.

---

## 🎯 Key Takeaways

1. **Client Pattern** - Bundle RPC + WebSocket + Wallet together
2. **Singleton Pattern** - Create once, reuse everywhere
3. **Local vs Devnet** - Different URLs, different ports
4. **Type Safety** - `@solana/kit` is strict, use `ReturnType<>` for inference
5. **Airdrops** - Only work on testnets, rate-limited on devnet

---

## 📖 Further Reading

- [Solana Kit Docs](https://github.com/solana-labs/solana-web3.js)
- [learnings.md](./learnings.md) - Beginner-friendly explanations

---

## 🏃 Quick Commands

```bash
bun run validator  # Start local Solana validator
bun start          # Run the tutorial code
```
