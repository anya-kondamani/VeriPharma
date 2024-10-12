module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Ganache port (default: none)
      network_id: "*",       // Any network (default: none)
    },
  },
  // Compiler configuration
  compilers: {
    solc: {
      version: "0.8.0",      // Specify Solidity compiler version
    }
  }
};