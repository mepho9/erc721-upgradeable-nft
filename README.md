# ERC721 Upgradeable NFT System

A fully functional, upgradeable ERC721 NFT smart contract system built with Hardhat using the proxy pattern.  
Features ERC20-based minting, ownership control, and seamless contract upgrades.  
Includes a complete suite of unit tests and deployment scripts for easy local development and testing.

---

## 🧱 Stack & Architecture

- **Solidity** `^0.8.20`
- **OpenZeppelin Contracts Upgradeable**
- **Hardhat** (local blockchain, deploy, test)
- **JavaScript** for deployment & testing
- **ERC721** with URI storage (upgradeable)
- **ERC20** token used for NFT payment
- **Proxy Pattern** (UUPS-compatible)

---

## 🧩 Features

- 🐻 **Upgradeable NFT system** (ERC721 via proxy)
- 💰 NFT minting only via ERC20 payment (`BearToken`)
- 🔐 Full `Ownable` access control (OpenZeppelin)
- 🔁 Upgradeable NFT logic (add god mode)
- 🔬 Full test suite (Mocha/Chai with Hardhat)
- 🛠 Easy to deploy and test locally

---

## 📁 Project Structure

```
├── contracts/
│ ├── BearToken.sol # ERC20 token (upgradeable)
│ ├── ProxyBearMinter.sol # Minter contract (upgradeable)
│ ├── ProxyBearNFT.sol # Current NFT logic
│ └── legacy/
│   └── LegacyProxyBearNFT.sol # Initial NFT contract (v1)
│
├── scripts/
│ ├── deploy.js # Deploy BearToken, Legacy NFT & Minter
│ ├── upgrade-nft.js # Upgrade NFT proxy to v2 (ProxyBearNFT)
│ ├── test-nft-mint.js # Simulate a full mint flow
│ └── test-godmode.js # Test godModeTransfer() in upgraded NFT
│
├── test/
│ ├── BearToken.test.js # Unit tests for BearToken
│ ├── LegacyProxyBearNFT.test.js # Unit tests for legacy NFT
│ ├── ProxyBearNFT.test.js # Tests for godMode NFT
│ └── ProxyBearMinter.test.js # Tests for minting and transfer logic
│
├── hardhat.config.js
├── package.json
└── README.md
```

---

## 🚀 Quick Start

> **Note:** You will need to keep Terminal 1 running the local blockchain while running deploy and test scripts in Terminal 2.


### 1. Install dependencies

```bash
npm install
```

### 2. Run a local blockchain (Terminal 1)

```bash
npx hardhat node
```

### 3. Deploy all contracts (Terminal 2)

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Simulate NFT minting

```bash
npx hardhat run scripts/test-nft-mint.js --network localhost
```

### 5. Upgrade the NFT logic (v1 to v2)

```bash
npx hardhat run scripts/upgrade-nft.js --network localhost
```

### 6. Test god mode transfer

```bash
npx hardhat run scripts/test-godmode.js --network localhost
```

---

## 🧪 Unit Testing (Hardhat + Mocha/Chai)

> All smart contracts are tested in isolation and in integration.

```bash
npx hardhat test
```

> Run a single test file:

```bash
npx hardhat test test/BearToken.test.js
npx hardhat test test/LegacyProxyBearNFT.test
npx hardhat test test/ProxyBearMinter.test.js
npx hardhat test test/ProxyBearNFT.test
```

---

## 🛠️ Available Scripts

- `deploy.js`: Deploys BearToken, Legacy NFT, and ProxyBearMinter (all upgradeable).
- `upgrade-nft.js`: Upgrades the NFT contract to ProxyBearNFT.
- `test-nft-mint.js`: Simulates a full minting flow using ERC20 payments.
- `test-godmode.js`: Tests the `godModeTransfer` function in the upgraded ProxyBearNFT.

---

## 📌 Hardhat Tools (Console)

> You can also use the built-in Hardhat console:

```bash
npx hardhat console --network localhost
```

---

## 👨‍💻 Author

**Rufat Babayev (Mepho9)**  
- GitHub: [@mepho9](https://github.com/mepho9)  
- LinkedIn: [rbabayev9](https://www.linkedin.com/in/rbabayev9/)

---

## 📄 License

MIT License, free to use with attribution.

---