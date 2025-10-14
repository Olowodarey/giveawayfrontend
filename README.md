# Gigi Pay - Seamless Crypto Payments Platform

**Gigi Pay** is a revolutionary crypto payment platform built on Starknet that makes sending and receiving cryptocurrency as simple as sending an email. No wallet setup, no gas fees, no complexity - just sign in with Gmail and start transacting.

## 🌟 What Makes Gigi Pay Special

Gigi Pay removes all barriers to crypto adoption by providing:

- **Zero Wallet Setup**: Automatic wallet creation on sign-in with Gmail
- **Gasless Transactions**: All transactions are free - powered by ChipiPay
- **Multi-Token Support**: Send STRK, USDC, USDT, ETH, and WBTC
- **Universal Sharing**: Share payment codes on any platform (Twitter, WhatsApp, Telegram, etc.)
- **No Crypto Knowledge Required**: Perfect for non-Web3 users
- **Instant Claims**: Recipients claim payments with just a code

## 🎯 Core Features

### For Senders
- **Bulk Payments**: Send to multiple recipients at once
- **Flexible Distribution**: Equal or random amount distribution
- **Gift Cards**: Create reusable payment codes
- **Salary Payments**: Perfect for remote teams and freelancers
- **Expiry Control**: Set custom expiry times or never-expire payments
- **Fund Recovery**: Reclaim unclaimed funds after expiry

### For Recipients
- **One-Click Claims**: Just enter the payment code
- **Automatic Wallet**: Wallet created automatically on first claim
- **No Gas Fees**: Completely free to claim
- **Multi-Token**: Receive any supported token
- **Social Sharing**: Share your wins on social media

### Platform Features
- **Dashboard**: Track all sent and received payments
- **Wallet Management**: Built-in wallet with balance tracking
- **Secure Authentication**: Powered by Clerk with Gmail integration
- **Mobile Optimized**: Works seamlessly on all devices

## 🏗️ Architecture

### Smart Contract (Cairo)
- **Network**: Starknet Mainnet
- **Contract Address**: `0x045fcf74e9e7cef23af8e9cd6fff04f6fb957360d8b180a0e4da9c56712fad19`
- **Language**: Cairo
- **Repository**: [Gigipay Contract on GitHub](https://github.com/Olowodarey/Gigipay-contract)
- **Features**:
  - Multi-token support (STRK, USDC, USDT, ETH, WBTC)
  - Poseidon hash-based claim codes
  - Flexible expiry management
  - Fund reclamation system
  - User statistics tracking



### Key Technologies
- **ChipiPay**: Gasless transaction sponsorship
- **Clerk**: Secure authentication and user management
- **Starknet**: Layer 2 scaling solution for Ethereum
- **Cairo**: Smart contract programming language

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- ChipiPay API Key ([Get one here](https://dashboard.chipipay.com/configure/api-keys))
- Clerk Account ([Sign up here](https://clerk.com))
- Tokens on Starknet Mainnet (STRK, USDC, USDT, ETH, or WBTC)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/gigi-pay.git
cd gigi-pay
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# ChipiPay Configuration
NEXT_PUBLIC_CHIPI_API_KEY=your_chipi_api_key_here

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Starknet Contract Configuration
NEXT_PUBLIC_GIVEAWAY_CONTRACT_ADDRESS=0x045fcf74e9e7cef23af8e9cd6fff04f6fb957360d8b180a0e4da9c56712fad19

# Token Addresses on Starknet Mainnet
NEXT_PUBLIC_STRK_TOKEN_ADDRESS=0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
NEXT_PUBLIC_USDC_TOKEN_ADDRESS=0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
NEXT_PUBLIC_USDT_TOKEN_ADDRESS=0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8
NEXT_PUBLIC_ETH_TOKEN_ADDRESS=0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
NEXT_PUBLIC_WBTC_TOKEN_ADDRESS=0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How It Works

### For Payment Senders

1. **Sign In with Gmail**
   - Click "Sign In" and authenticate with your Gmail account
   - Your Starknet wallet is automatically created in the background
   - No manual wallet setup required!

2. **Create a Payment**
   - Navigate to the Create page (`/create`)
   - Choose your token (STRK, USDC, USDT, ETH, or WBTC)
   - Enter total amount and number of recipients
   - Select distribution type (equal or random amounts)
   - Set expiry time (hours, days, or never expire)

3. **Generate Payment Codes**
   - System generates unique claim codes for each recipient
   - Download CSV file with all codes and amounts
   - Codes are secured with Poseidon hashing

4. **Share Payment Codes**
   - Share codes via any platform (WhatsApp, Telegram, Twitter, Email, etc.)
   - Recipients don't need any crypto knowledge
   - All transactions are completely gasless

### For Payment Recipients

1. **Receive a Payment Code**
   - Get a payment code from the sender (e.g., "STRK-ABC123XYZ")
   - No prior crypto experience needed

2. **Claim Your Payment**
   - Visit the Claim page (`/claim`)
   - Sign in with Gmail (wallet auto-created)
   - Enter the payment name and claim code
   - Click "Claim Payment"

3. **Receive Tokens**
   - Tokens are instantly transferred to your wallet
   - Zero gas fees - completely free
   - Share your success on social media!

### Using Your Wallet

1. **View Balance**
   - Navigate to Wallet page (`/wallet`)
   - See balances for all supported tokens
   - Copy your wallet address

2. **Send Tokens**
   - Enter recipient address and amount
   - Select token to send
   - Confirm transaction (gasless!)

3. **Track Activity**
   - View your dashboard (`/dashboard`)
   - See all sent and received payments
   - Track claimed vs unclaimed payments
   - Reclaim expired unclaimed funds

## 🔐 Security Features

- **Poseidon Hashing**: Claim codes are hashed using Starknet's native Poseidon hash function
- **One Claim Per Code**: Each code can only be claimed once
- **Encrypted Wallets**: Private keys encrypted with deterministic user-specific PINs
- **On-Chain Verification**: All validations happen on the smart contract
- **Secure Authentication**: Clerk handles OAuth and session management
- **No Private Key Exposure**: Users never see or handle private keys
- **Automatic Wallet Isolation**: Each user gets a unique wallet tied to their account

## 💡 Use Cases

### 1. Remote Team Salaries
Pay your global team in crypto without worrying about:
- Bank transfer fees
- Currency conversion
- Delayed payments
- Complex wallet setups

### 2. Freelancer Payments
Perfect for paying freelancers:
- Instant payments in stablecoins (USDC/USDT)
- No intermediaries
- Global reach
- Transparent transaction history

### 3. Community Airdrops
Distribute tokens to your community:
- Bulk payment generation
- Easy code distribution
- Track claim rates
- Reclaim unclaimed tokens

### 4. Gift Cards & Vouchers
Create crypto gift cards:
- Never-expire option
- Reusable codes
- Multiple token options
- Social media friendly

### 5. Giveaways & Contests
Run social media contests:
- Random or equal distribution
- Mystery amounts for excitement
- Universal social sharing
- Automatic winner selection

## 📁 Project Structure

```
gigi-pay/
├── app/
│   ├── create/              # Payment creation page
│   ├── claim/               # Payment claiming page
│   ├── dashboard/           # User dashboard
│   ├── wallet/              # Wallet management
│   ├── giftcards/           # Gift card feature
│   ├── sign-in/             # Clerk sign-in
│   ├── sign-up/             # Clerk sign-up
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── header.tsx           # Navigation header
│   ├── footer.tsx           # Page footer
│   ├── social-share.tsx     # Universal sharing component
│   └── enhanced-social-share.tsx  # Advanced sharing
├── contexts/
│   └── wallet-context.tsx   # Wallet state management
├── lib/
│   ├── contract-config.ts   # Contract addresses and ABIs
│   ├── contract-utils.ts    # Blockchain utilities
│   ├── token-config.ts      # Multi-token configuration
│   ├── share-utils.ts       # Social sharing utilities
│   └── utils.ts             # General utilities
├── constants/
│   ├── abi.ts               # Contract ABI
│   └── index.ts             # App constants
├── hooks/                   # Custom React hooks
└── public/                  # Static assets
```


## 🔗 Important Links

### Live Application & Code
- 🌐 **Live Demo**: [https://gigipay-ruby.vercel.app/](https://gigipay-ruby.vercel.app/)
- 💻 **Frontend Repository**: [GitHub - Frontend](https://github.com/yourusername/gigi-pay)
- 📜 **Smart Contract Repository**: [GitHub - Contract](https://github.com/Olowodarey/Gigipay-contract)
- 🔍 **Contract on Voyager**: [View on Voyager](https://voyager.online/contract/0x045fcf74e9e7cef23af8e9cd6fff04f6fb957360d8b180a0e4da9c56712fad19)



---
\