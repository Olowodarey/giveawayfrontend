# Mainnet Migration Complete ✅

## Summary

The application has been migrated from Starknet Sepolia (testnet) to Starknet Mainnet to work with Chipi Pay, which only supports mainnet.

## Changes Made

### 1. Environment Variables (`.env.local`)

- ✅ Updated contract addresses to mainnet
- ✅ Added `NEXT_PUBLIC_STARKNET_NETWORK=mainnet`
- ✅ STRK Token Address: `0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d` (Mainnet)
- ✅ Giveaway Contract: `0x077af435e43da39a5c75ea90ea143abfdbb03e812a71803a21b1ad0d065f3847` (Mainnet)

### 2. RPC Endpoints

- ✅ Updated balance fetching to use mainnet RPC: `https://starknet-mainnet.public.blastapi.io`
- ✅ Located in: `app/wallet/page.tsx`

### 3. Block Explorer Links

- ✅ Changed from `https://sepolia.starkscan.co` to `https://starkscan.co`
- ✅ Located in: `components/connect-wallet.tsx`

### 4. Chipi Pay Configuration

- ✅ Using production API keys (already configured)
- ✅ API Key: `pk_prod_5e5488f15194f4b7df58d3ef616461f3`

## Important Notes

### Contract Deployment

Your giveaway contract **MUST be deployed on Starknet Mainnet** at the address specified in `.env.local`.

To deploy your contract on mainnet:

```bash
# Build the contract
scarb build

# Declare the contract class
starkli declare target/dev/your_contract.contract_class.json --network mainnet

# Deploy the contract
starkli deploy <CLASS_HASH> <CONSTRUCTOR_ARGS> --network mainnet
```

### Wallet Account Deployment

Users' Chipi wallets need to be deployed on mainnet before they can:

- Send tokens
- Create giveaways
- Claim prizes

Use the `/deploy-account` page to deploy user accounts.

### Real STRK Tokens

⚠️ **IMPORTANT**: You're now on mainnet, which means:

- Real STRK tokens (not testnet tokens)
- Real transactions with real value
- Gas fees are paid in real ETH (or gasless via Chipi)

### Testing

Before going live:

1. ✅ Verify contract is deployed on mainnet
2. ✅ Test wallet creation with Chipi
3. ✅ Test account deployment
4. ✅ Test small STRK transfer
5. ✅ Test giveaway creation with minimal amount
6. ✅ Test claim functionality

## Network Endpoints

### Mainnet RPC

- Blast API: `https://starknet-mainnet.public.blastapi.io`
- Infura: `https://starknet-mainnet.infura.io/v3/YOUR_KEY`
- Alchemy: `https://starknet-mainnet.g.alchemy.com/v2/YOUR_KEY`

### Block Explorers

- Starkscan: https://starkscan.co
- Voyager: https://voyager.online

## Mainnet Resources

### STRK Token

- Contract: `0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d`
- Symbol: STRK
- Decimals: 18

### Getting Mainnet STRK

Users can get STRK from:

- Centralized exchanges (Binance, Coinbase, etc.)
- DEXs (Avnu, Jediswap, 10KSwap)
- Bridge from Ethereum

## Security Considerations

⚠️ **Production Checklist**:

- [ ] Contract audited
- [ ] Admin keys secured
- [ ] Rate limiting implemented
- [ ] Error handling tested
- [ ] Monitoring set up
- [ ] Backup plan for contract upgrades

## Support

If you encounter issues:

1. Check Chipi Pay docs: https://docs.chipipay.com
2. Check Starknet docs: https://docs.starknet.io
3. Verify contract on Starkscan
4. Check wallet deployment status

---

**Migration Date**: October 4, 2025
**Network**: Starknet Mainnet
**Status**: ✅ Complete
