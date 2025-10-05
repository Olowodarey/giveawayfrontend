# Quick Setup Guide

## Step 1: Get ChipiPay API Key

1. Go to [ChipiPay Dashboard](https://dashboard.chipipay.com/configure/api-keys)
2. Sign up or log in
3. Navigate to API Keys section
4. Copy your **Public Key** (starts with `pk_prod_`)

## Step 2: Configure Environment

Your `.env.local` file should already have the ChipiPay key you added:

```env
NEXT_PUBLIC_CHIPI_API_KEY=pk_prod_5e5488f15194f4b7df58d3ef616461f3
NEXT_PUBLIC_GIVEAWAY_CONTRACT_ADDRESS=0x077af435e43da39a5c75ea90ea143abfdbb03e812a71803a21b1ad0d065f3847
NEXT_PUBLIC_STRK_TOKEN_ADDRESS=0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
```

## Step 3: Get Test STRK Tokens

1. Visit [Starknet Sepolia Faucet](https://faucet.goerli.starknet.io/) or use the [Blast API Faucet](https://blastapi.io/faucets/starknet-sepolia-eth)
2. Request STRK tokens for testing
3. You'll need these to create giveaways

## Step 4: Run the Application

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## Step 5: Test the Flow

### Create a Giveaway

1. Go to `/create`
2. Fill in:
   - Total Prize: `10` STRK (or any amount you have)
   - Number of Winners: `3`
   - Distribution: Equal or Random
   - Expiry: `24` hours
3. Click "Next: Preview"
4. Click "Deposit STRK & Generate Codes"
5. Enter a PIN (e.g., `1234`) - **Remember this!**
6. Wait for wallet creation and transaction
7. Copy the generated claim codes

### Claim a Prize

1. Go to `/claim`
2. Enter one of the generated codes
3. Click "Validate Code"
4. Click "Connect Wallet & Claim"
5. Enter your PIN (same or different)
6. Watch the confetti! 🎉

## Important Notes

### Authentication

Currently using a simplified "demo_token" for bearer authentication. In production, you should:

- Integrate proper authentication (Clerk, Auth0, etc.)
- Get real bearer tokens from your auth provider
- Pass user IDs from your auth system

### Wallet Persistence

Wallets are currently stored in component state. For production:

- Store wallet info in localStorage or database
- Retrieve existing wallets using `useGetWallet` hook
- Implement proper wallet management

### Production Checklist

Before deploying to production:

- [ ] Implement real authentication system
- [ ] Store wallets persistently
- [ ] Add proper error handling
- [ ] Query actual prize amounts from contract events
- [ ] Add transaction confirmation UI
- [ ] Implement wallet recovery mechanism
- [ ] Add rate limiting
- [ ] Set up monitoring and analytics
- [ ] Test on mainnet with small amounts first
- [ ] Update contract address for mainnet

## Troubleshooting

### "Failed to create wallet"

- Check your ChipiPay API key is correct
- Ensure you have internet connection
- Try a different PIN

### "Failed to create giveaway"

- Make sure you have enough STRK tokens
- Check the contract address is correct
- Verify you're on Sepolia testnet

### "Claim failed"

- Code might be invalid or already claimed
- Check giveaway hasn't expired
- Ensure you're using the correct giveaway ID

### TypeScript Errors

Some ChipiPay types might show errors. This is expected as we're using `any` types for flexibility. The code will still work.

## Next Steps

1. **Customize UI**: Update colors, branding, and copy
2. **Add Features**: Implement the future enhancements from README
3. **Deploy**: Push to Vercel or your preferred platform
4. **Test Thoroughly**: Create multiple giveaways and test edge cases
5. **Go Live**: Share with your community!

## Resources

- [ChipiPay Docs](https://docs.chipipay.com/)
- [Starknet Docs](https://docs.starknet.io/)
- [Next.js Docs](https://nextjs.org/docs)
- [Contract on Starkscan](https://sepolia.starkscan.co/contract/0x077af435e43da39a5c75ea90ea143abfdbb03e812a71803a21b1ad0d065f3847)

---

Need help? Open an issue or reach out to the community!
