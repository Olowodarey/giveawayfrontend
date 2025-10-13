# StarkGive - Mystery Giveaway Platform

A social giveaway platform built on Starknet where users can't see prize amounts until they claim - creating excitement and mystery! Share on any platform and powered by ChipiPay for gasless transactions.

## 🎁 Features

- **Mystery Prizes**: Prize amounts are hidden until claimed
- **Gasless Transactions**: All transactions sponsored via ChipiPay (no gas fees!)
- **Universal Social Sharing**: Share on Twitter, Facebook, LinkedIn, WhatsApp, Telegram, Reddit, and more
- **Equal or Random Distribution**: Choose how to split prizes
- **Secure Code System**: Poseidon hash-based claim codes
- **Expiry Management**: Set custom expiry times for giveaways
- **Native Share API**: Mobile-optimized sharing with device's native menu

## 🏗️ Architecture

### Smart Contract

- **Network**: Starknet Sepolia Testnet
- **Contract Address**: `0x045fcf74e9e7cef23af8e9cd6fff04f6fb957360d8b180a0e4da9c56712fad19`
- **Token**: STRK (Starknet Token)

### Frontend

- **Framework**: Next.js 14 with TypeScript
- **Wallet**: ChipiPay SDK (Gasless Argent wallets)
- **UI**: Tailwind CSS + shadcn/ui components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- ChipiPay API Key ([Get one here](https://dashboard.chipipay.com/configure/api-keys))
- STRK tokens on Sepolia testnet

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd crypto-giveaway-platform
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# ChipiPay Configuration
NEXT_PUBLIC_CHIPI_API_KEY=pk_prod_your_api_key_here

# Starknet Contract Configuration
NEXT_PUBLIC_GIVEAWAY_CONTRACT_ADDRESS=0x045fcf74e9e7cef23af8e9cd6fff04f6fb957360d8b180a0e4da9c56712fad19

# STRK Token Address on Sepolia
NEXT_PUBLIC_STRK_TOKEN_ADDRESS=0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How It Works

### For Giveaway Creators

1. **Navigate to Create Page** (`/create`)
2. **Enter Giveaway Details**:

   - Total prize pool (STRK)
   - Number of winners
   - Distribution type (equal or random)
   - Expiry time in hours

3. **Create Wallet & Deposit**:

   - Enter a secure PIN to create your gasless wallet
   - Approve STRK tokens (gasless)
   - Deposit tokens to contract (gasless)

4. **Get Claim Codes**:
   - Unique codes are generated for each winner
   - Download CSV with codes and amounts
   - Share codes on Twitter using the template

### For Prize Claimers

1. **Navigate to Claim Page** (`/claim`)
2. **Enter Claim Code**: Input the code you received
3. **Validate Code**: System checks if code is valid
4. **Connect Wallet**:
   - Enter a secure PIN to create your gasless wallet
   - Claim your mystery prize (gasless!)
5. **Celebrate**: See your prize amount and share on Twitter!

## 🔐 Security Features

- **Poseidon Hashing**: Claim codes are hashed using Starknet's Poseidon hash
- **One Claim Per Address**: Each address can only claim once per giveaway
- **Encrypted Wallets**: ChipiPay encrypts private keys with user PIN
- **On-Chain Verification**: All validations happen on the smart contract

## 🎨 Tech Stack

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Beautiful component library
- **ChipiPay SDK**: Gasless wallet management

### Smart Contract

- **Cairo**: Starknet smart contract language
- **OpenZeppelin**: Security-audited contract components
- **Starknet**: Layer 2 scaling solution

### Key Libraries

- `@chipi-stack/nextjs`: ChipiPay integration
- `starknet`: Starknet utilities
- `lucide-react`: Icon library
- `react-confetti`: Celebration effects

## 📁 Project Structure

```
crypto-giveaway-platform/
├── app/
│   ├── create/          # Giveaway creation page
│   ├── claim/           # Prize claiming page
│   ├── dashboard/       # Dashboard page
│   ├── layout.tsx       # Root layout with ChipiProvider
│   └── page.tsx         # Home page
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── header.tsx       # Navigation header
│   └── footer.tsx       # Page footer
├── lib/
│   ├── contract-config.ts   # Contract addresses and ABIs
│   ├── contract-utils.ts    # Utility functions
│   └── utils.ts             # General utilities
├── hooks/               # Custom React hooks
└── public/              # Static assets
```

## 🔧 Contract Functions

### `create_giveaway`

Creates a new giveaway with hashed claim codes.

**Parameters**:

- `total_amount`: Total STRK to distribute
- `code_hashes`: Array of hashed claim codes
- `prize_amounts`: Array of prize amounts (u256)
- `expiry_hours`: Hours until expiry

### `claim_prize`

Claims a prize using a claim code.

**Parameters**:

- `giveaway_id`: ID of the giveaway
- `code`: Unhashed claim code (felt252)

### `get_giveaway_info`

Retrieves giveaway information.

**Parameters**:

- `giveaway_id`: ID of the giveaway

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `NEXT_PUBLIC_CHIPI_API_KEY`
- `NEXT_PUBLIC_GIVEAWAY_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_STRK_TOKEN_ADDRESS`

## 🧪 Testing

### Test on Sepolia

1. Get Sepolia STRK tokens from faucet
2. Create a test giveaway with small amounts
3. Generate claim codes
4. Test claiming with different addresses

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- [ChipiPay Documentation](https://docs.chipipay.com/)
- [Starknet Documentation](https://docs.starknet.io/)
- [Contract on Starkscan](https://sepolia.starkscan.co/contract/0x045fcf74e9e7cef23af8e9cd6fff04f6fb957360d8b180a0e4da9c56712fad19)

## 💡 Future Enhancements

- [ ] Multi-token support (ETH, USDC, etc.)
- [ ] NFT giveaways
- [ ] Scheduled giveaways
- [ ] Analytics dashboard
- [ ] Social authentication (Twitter, Discord)
- [ ] Mainnet deployment

## 🐛 Known Issues

- Bearer token authentication is simplified for demo (use proper auth in production)
- Prize amounts shown after claiming are simulated (should query from contract events)
- Wallet persistence needs improvement (currently session-based)

## 📞 Support

For issues or questions:

- Open an issue on GitHub
- Contact ChipiPay support: [Telegram](https://t.me/+e2qjHEOwImkyZDVh)

---

Built with ❤️ for the Starknet community
