# Aptos NFT Marketplace

A decentralized NFT marketplace built on the Aptos blockchain that enables users to mint, buy, sell, transfer NFTs, and reward creators.

# Discord Username : praveenkumar1
# X Username : praveenkum59591

## Features

### Core Features

1. **NFT Management**

   - Mint new NFTs with custom attributes
   - List NFTs for sale with custom pricing
   - Transfer NFTs between addresses
   - View owned NFTs and their details

2. **Marketplace Functions**

   - Browse available NFTs
   - Purchase NFTs using APT
   - Filter NFTs by rarity
   - View detailed NFT information

3. **Creator Rewards**

   - Send APT rewards to NFT creators
   - View creator statistics
   - Track minting history

4. **Wallet Integration**
   - Petra Wallet support
   - Secure transaction signing
   - Account management

### Technical Features

- Responsive UI design
- Real-time transaction feedback
- Optimized image loading
- Error handling and recovery
- Mobile-friendly interface

## Technical Stack

### Blockchain

- Aptos Blockchain
- Move Language
- Aptos Framework

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Headless UI

### Development Tools

- Node.js
- Aptos CLI
- Move Compiler
- Git

## Prerequisites

1. **Development Environment**

   ```bash
   Node.js >= v16.0.0
   npm >= v8.0.0
   Aptos CLI >= v1.0.0
   ```

2. **Wallet Requirements**
   - Petra Wallet Browser Extension
   - Test APT tokens for transactions

## Smart Contract

### Contract Structure

```move
struct NFT has store, key {
    id: u64,
    owner: address,
    minter: address,
    name: vector<u8>,
    description: vector<u8>,
    uri: vector<u8>,
    price: u64,
    for_sale: bool,
    rarity: u8
}

struct Marketplace has key {
    nfts: vector<NFT>,
    sales: vector<NFTSale>,
    next_id: u64
}
```

### Deployment Steps

1. **Install Aptos CLI**

   ```bash
   curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
   ```

2. **Initialize Aptos Account**

   ```bash
   aptos init
   ```

3. **Update Contract Address**

   ```move
   address 0xYOUR_ADDRESS_HERE {
       module Marketplace {
           // ... contract code
       }
   }

   all the places of "@0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710"
   ```

4. **Compile and Deploy**
   ```bash
   aptos move compile
   aptos move publish --named-addresses marketplace=YOUR_ADDRESS
   ```

## Frontend Setup

1. **Clone Repository**

   ```bash
   git clone (https://github.com/praveenkumar11901/nft-marketplace-react-vite)
   cd aptos-nft-marketplace
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Update Constants**

   ```typescript
   // src/constants/Constants.ts
   export const MARKETPLACE_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
   export const MODULE_NAME = "Marketplace";
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

```
├── contracts/
│   └── sources/
│       └── NFT.move          # Smart contract
├── src/
│   ├── components/
│   │   ├── Header.tsx        # Navigation component
│   │   └── wallet/          # Wallet integration
│   ├── constants/
│   │   └── Constants.ts     # Global constants
│   ├── pages/
│   │   ├── Discover.tsx     # Marketplace page
│   │   ├── Mint.tsx        # NFT minting page
│   │   ├── MintedNFT.tsx   # User's NFTs page
│   │   └── Reward.tsx      # Creator rewards page
│   └── App.tsx             # Main application
└── public/                 # Static assets
```

## Usage Guide

### Minting NFTs

1. Connect Petra Wallet
2. Navigate to "MINT" page
3. Fill required fields:
   - Name
   - Description
   - Image URI
   - Rarity Level
4. Confirm transaction

### Listing NFTs for Sale

1. Go to "MINTED" page
2. Select NFT
3. Click "List for Sale"
4. Set price in APT
5. Confirm listing

### Buying NFTs

1. Browse NFTs on "DISCOVER" page
2. Click "Buy" on desired NFT
3. Confirm purchase transaction
4. Wait for transaction confirmation

### Rewarding Creators

1. Visit "REWARD" page
2. Select creator
3. Enter reward amount
4. Send reward transaction

## Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
```

### Code Style

- ESLint configuration
- Prettier formatting
- TypeScript strict mode

## Troubleshooting

### Common Issues

1. **Wallet Connection**

   ```typescript
   // Check wallet connection
   if (!connected) {
     alert("Please connect your wallet first");
     return;
   }
   ```

2. **Transaction Errors**

   - Insufficient APT balance
   - Network congestion
   - Invalid transaction payload

3. **Image Loading**
   ```typescript
   onError={(e) => {
     (e.target as HTMLImageElement).src = "/placeholder-image.png";
   }}
   ```

### Support

- GitHub Issues
- Documentation
- Community Discord

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Submit Pull Request

## Acknowledgments

- Aptos Team
- Move Language Documentation
- React Community
- Open Source Contributors
