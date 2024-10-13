const hre = require("hardhat");
const { formatEther } = require("ethers");  // Import formatEther from ethers

async function main() {
  // Get the deployer account (signer)
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Fetch the balance using the provider directly
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const formattedBalance = formatEther(balance);
  console.log("Account balance:", formattedBalance);

  // Deploy the Registration contract
  const Registration = await hre.ethers.getContractFactory("Registration");
  const registration = await Registration.deploy();  // Deployment happens here
  console.log("Registration contract deployed to:", registration.target);  // In Ethers v6, use .target instead of .address

  // Deploy the DrugTracking contract
  const DrugTracking = await hre.ethers.getContractFactory("DrugTracking");
  const drugTracking = await DrugTracking.deploy();
  console.log("DrugTracking contract deployed to:", drugTracking.target);

  // Deploy the EventLogging contract
  const EventLogging = await hre.ethers.getContractFactory("EventLogging");
  const eventLogging = await EventLogging.deploy();
  console.log("EventLogging contract deployed to:", eventLogging.target);

  // Deploy the DrugVerification contract
  const DrugVerification = await hre.ethers.getContractFactory("DrugVerification");
  const drugVerification = await DrugVerification.deploy();
  console.log("DrugVerification contract deployed to:", drugVerification.target);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in deployment:", error);
    process.exit(1);
  });
