const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY, 
        `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      ),
      network_id: 11155111,
      gas: 5500000,               // Reduced gas limit
      gasPrice: 2000000000,       // Reduced gas price to 1 Gwei
      confirmations: 1,
      timeoutBlocks: 200,         // Reduced timeout blocks
      skipDryRun: true,
      networkCheckTimeout: 1000000
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};