const hre = require("hardhat");

async function main() {
  console.log("Checking ethers object...");

  // Check if ethers is properly available
  if (hre.ethers) {
    console.log("ethers object is available");

    // Check if ethers.utils is available and has formatEther
    if (hre.ethers.utils && hre.ethers.utils.formatEther) {
      console.log("ethers.utils.formatEther is available");
    } else {
      console.log("ethers.utils.formatEther is NOT available");
    }
  } else {
    console.log("ethers object is NOT available");
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
