require('dotenv').config();
const { ethers } = require('ethers');  // Correct way for Node.js

// Fetch your environment variables from the .env file
const privateKey = process.env.PRIVATE_KEY;
const alchemyApiKey = process.env.ALCHEMY_API_KEY;

// Check if the keys are loaded
if (!privateKey || !alchemyApiKey) {
    console.error("Missing PRIVATE_KEY or ALCHEMY_API_KEY from .env");
    process.exit(1);
}

// Set up the provider and wallet using the Sepolia network
const provider = new ethers.providers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`);
const wallet = new ethers.Wallet(privateKey, provider);

// Contract addresses and ABI definitions
const registrationAddress = "0xA1e2c31c5cac1c40c8EC5432e1bf25924B10D2b4"; // Registration contract address
const drugTrackingAddress = "0x906A44927Da9062F9f95f29A28e75fbD74e6792a";  // Drug Tracking contract address

// Registration ABI
const registrationABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_stakeholderAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_role",
                "type": "string"
            }
        ],
        "name": "registerStakeholder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Drug tracking ABI
const drugTrackingABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_serialNumber",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_batchId",
                "type": "string"
            }
        ],
        "name": "createDrug",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_batchId",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_supplyNumber",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_manufactureDate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_expirationDate",
                "type": "uint256"
            }
        ],
        "name": "createBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_serialNumber",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_newOwner",
                "type": "address"
            }
        ],
        "name": "transferDrug",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_serialNumber",
                "type": "string"
            }
        ],
        "name": "markDrugFaulty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_serialNumber",
                "type": "string"
            }
        ],
        "name": "verifyDrug",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Create contract instances
const registrationContract = new ethers.Contract(registrationAddress, registrationABI, wallet);
const drugTrackingContract = new ethers.Contract(drugTrackingAddress, drugTrackingABI, wallet);

// Register a stakeholder
async function registerStakeholder(role) {
    try {
        const tx = await registrationContract.registerStakeholder(wallet.address, role);
        console.log(`Transaction Hash: ${tx.hash}`);
        await tx.wait(); // Wait for the transaction to be mined
        console.log(`Stakeholder registered with role: ${role}`);
    } catch (error) {
        console.error("Error registering stakeholder:", error);
    }
}

// Create a drug
async function createDrug(serialNumber, batchId) {
    try {
        const tx = await drugTrackingContract.createDrug(serialNumber, batchId);
        console.log(`Transaction Hash: ${tx.hash}`);
        await tx.wait(); // Wait for the transaction to be mined
        console.log(`Drug created with serial number: ${serialNumber}`);
    } catch (error) {
        console.error("Error creating drug:", error);
    }
}

// Create a batch
async function createBatch(batchId, supplyNumber, manufactureDate, expirationDate) {
    try {
        const tx = await drugTrackingContract.createBatch(batchId, supplyNumber, manufactureDate, expirationDate);
        console.log(`Transaction Hash: ${tx.hash}`);
        await tx.wait(); // Wait for the transaction to be mined
        console.log(`Batch created with batch ID: ${batchId}`);
    } catch (error) {
        console.error("Error creating batch:", error);
    }
}

// Transfer a drug
async function transferDrug(serialNumber, newOwner) {
    try {
        const tx = await drugTrackingContract.transferDrug(serialNumber, newOwner);
        console.log(`Transaction Hash: ${tx.hash}`);
        await tx.wait(); // Wait for the transaction to be mined
        console.log(`Drug transferred with serial number: ${serialNumber} to ${newOwner}`);
    } catch (error) {
        console.error("Error transferring drug:", error);
    }
}

// Mark a drug as faulty
async function markDrugFaulty(serialNumber) {
    try {
        const tx = await drugTrackingContract.markDrugFaulty(serialNumber);
        console.log(`Transaction Hash: ${tx.hash}`);
        await tx.wait(); // Wait for the transaction to be mined
        console.log(`Drug marked as faulty: ${serialNumber}`);
    } catch (error) {
        console.error("Error marking drug as faulty:", error);
    }
}

// Verify a drug
async function verifyDrug(serialNumber) {
    try {
        const tx = await drugTrackingContract.verifyDrug(serialNumber);
        console.log(`Transaction Hash: ${tx.hash}`);
        await tx.wait(); // Wait for the transaction to be mined
        console.log(`Drug verified: ${serialNumber}`);
    } catch (error) {
        console.error("Error verifying drug:", error);
    }
}

(async () => {
    const now = new Date();

    // Get the current timestamp in seconds
    const manufactureDate = Math.floor(now.getTime() / 1000);

    // Set an expiration date (e.g., 50 days from the manufacture date)
    const daysToAdd = 50;
    const expirationDate = Math.floor((now.getTime() + (daysToAdd * 24 * 60 * 60 * 1000)) / 1000);

    // Register stakeholders
    await registerStakeholder("MANUFACTURER");
    await registerStakeholder("RETAILER");
    await registerStakeholder("END_USER");

    // Create a new batch with t
    imestamps
    await createBatch("batch1", 5, manufactureDate, expirationDate);  // Example dates: manufactureDate and expirationDate

    // Create a new drug
    await createDrug("SN1234567890", "batch1");
    await createDrug("SN0987654321", "batch1");

    // Transfer the drug to a new owner (replace with the actual address)
    await transferDrug("SN1234567890", "0xBB29A8f6e6Fb64E9DFD44cc3f21E62d3f3aBD779");
    await transferDrug("SN0987654321", "0xBB29A8f6e6Fb64E9DFD44cc3f21E62d3f3aBD779");

    // Verify a drug
    await verifyDrug("SN1234567890");
    await verifyDrug("SN0987654321");

    // Mark a drug as faulty
    await markDrugFaulty("SN1234567890");

    // Verify a drug again
    await verifyDrug("SN1234567890");
    await verifyDrug("SN0987654321");
})();
