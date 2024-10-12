const { ethers } = ('ethers');

// Set up contract ABIs and deployed addresses
const drugTrackingABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "batchId",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "manufacturer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "supplyNumber",
          "type": "uint256"
        }
      ],
      "name": "BatchCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "batchId",
          "type": "string"
        }
      ],
      "name": "BatchMarkedFaulty",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "serialNumber",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "batchId",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "DrugCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "serialNumber",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "DrugTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "batchId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "incorrectSupplyNumber",
          "type": "uint256"
        }
      ],
      "name": "SupplyNumberAlert",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "batchToDrugs",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "batches",
      "outputs": [
        {
          "internalType": "string",
          "name": "batchId",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isFaulty",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "supplyNumber",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "manufacturer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "manufactureDate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "expirationDate",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "drugHistory",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "drugs",
      "outputs": [
        {
          "internalType": "string",
          "name": "serialNumber",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "batchId",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "currentOwner",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isVerified",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
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
          "name": "_serialNumber",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_supplyNumber",
          "type": "uint256"
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
          "name": "_batchId",
          "type": "string"
        }
      ],
      "name": "markBatchFaulty",
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
      "name": "getDrugDetails",
      "outputs": [
        {
          "internalType": "string",
          "name": "batchId",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "currentOwner",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isVerified",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isBatchFaulty",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "supplyNumber",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_serialNumber",
          "type": "string"
        }
      ],
      "name": "getDrugHistory",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
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
  ]
const eventLoggingABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "batchOrSerialId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "eventType",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "eventOwner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "details",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "supplyNumber",
          "type": "uint256"
        }
      ],
      "name": "EventLogged",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "eventsLog",
      "outputs": [
        {
          "internalType": "string",
          "name": "batchOrSerialId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "eventType",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "eventOwner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "details",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "supplyNumber",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_batchOrSerialId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_eventType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_details",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_supplyNumber",
          "type": "uint256"
        }
      ],
      "name": "logEvent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_batchOrSerialId",
          "type": "string"
        }
      ],
      "name": "getEvents",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "batchOrSerialId",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "eventType",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "eventOwner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "details",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "supplyNumber",
              "type": "uint256"
            }
          ],
          "internalType": "struct EventLogging.Event[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ]
const registrationABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "stakeholder",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "role",
          "type": "string"
        }
      ],
      "name": "StakeholderRegistered",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "stakeholderList",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "stakeholders",
      "outputs": [
        {
          "internalType": "address",
          "name": "stakeholderAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "role",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isRegistered",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
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
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_stakeholderAddress",
          "type": "address"
        }
      ],
      "name": "getStakeholderDetails",
      "outputs": [
        {
          "internalType": "string",
          "name": "role",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "registered",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_stakeholderAddress",
          "type": "address"
        }
      ],
      "name": "isRegistered",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getStakeholders",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
const drugVerificationABI =[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "batchId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isFlagged",
          "type": "bool"
        }
      ],
      "name": "BatchFlagged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "batchId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isVerified",
          "type": "bool"
        }
      ],
      "name": "BatchVerified",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "serialNumber",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isFlagged",
          "type": "bool"
        }
      ],
      "name": "DrugFlagged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "batchId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "incorrectSupplyNumber",
          "type": "uint256"
        }
      ],
      "name": "SupplyNumberAlert",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "flaggedBatches",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "flaggedDrugs",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "verifiedBatches",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "verifiedDrugs",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_batchId",
          "type": "string"
        }
      ],
      "name": "verifyBatch",
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
        }
      ],
      "name": "flagBatch",
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
      "name": "flagDrug",
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
        }
      ],
      "name": "isBatchVerified",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_batchId",
          "type": "string"
        }
      ],
      "name": "isBatchFlagged",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_serialNumber",
          "type": "string"
        }
      ],
      "name": "isDrugFlagged",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
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
          "name": "_incorrectSupplyNumber",
          "type": "uint256"
        }
      ],
      "name": "alertSupplyNumberDiscrepancy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

const drugTrackingAddress = "0x6b92c19e22bFd731EAb8cFB207E7DD76122E63Fc";  // Replace with actual deployed address
const eventLoggingAddress = "0x6E5181fd4dd6cd9a2C1A95917dc57E80f1a65636";  // Replace with actual deployed address
const registrationAddress = "0x6e13c3dC45083a4C838421a1F684c37949a4D082";  // Replace with actual deployed address
const drugVerificationAddress = "0x94cCAd4e39c8aca6338a88d443F170DeA783F144";  // Replace with actual deployed address

/*
async function connectToMetaMask() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            document.getElementById("accountDisplay").innerText = `Connected Account: ${account}`;
        } catch (error) {
            console.error("User denied MetaMask connection:", error);
        }
    } else {
        alert("Please install MetaMask to interact with this dApp.");
    }
}


async function connectToMetaMask() {
    if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return signer;
    } else {
        console.log("MetaMask is not installed");
        return null;
    }
}*/


export async function connectToMetaMask() {
    if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return signer;
    } else {
        console.log("MetaMask is not installed");
        return null;
    }
}



export async function registerStakeholder(role) {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const registrationContract = new ethers.Contract(registrationAddress, registrationABI, signer);
    const userAddress = await signer.getAddress();  // Get connected account address

    try {
        // Trigger MetaMask popup to sign the transaction
        const tx = await registrationContract.registerStakeholder(userAddress, role);
        await tx.wait();  // Wait for the transaction to be mined
        alert("Stakeholder registered successfully!");
    } catch (error) {
        console.error("Error registering stakeholder:", error);
    }
}

// Get stakeholder details using the Registration contract
export async function getStakeholderDetails(stakeholderAddress) {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(registrationAddress, registrationABI, signer);

    try {
        const details = await contract.getStakeholderDetails(stakeholderAddress);
        console.log("Stakeholder details:", details);
        return details;
    } catch (error) {
        console.error("Error fetching stakeholder details:", error);
    }
}

export async function createDrug(serialNumber, batchId) {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(drugTrackingAddress, drugTrackingABI, signer);

    try {
        const tx = await contract.createDrug(serialNumber, batchId);
        await tx.wait();
        alert(`Drug created with serial number: ${serialNumber}`);
    } catch (error) {
        console.error("Error creating drug:", error);
    }
}


export async function getDrugDetails(serialNumber) {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(drugTrackingAddress, drugTrackingABI, signer);

    try {
        const details = await contract.getDrugDetails(serialNumber);
        console.log("Drug details:", details);
        return details;
    } catch (error) {
        console.error("Error fetching drug details:", error);
    }
}

export async function logEvent(batchOrSerialId, eventType, details, supplyNumber) {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(eventLoggingAddress, eventLoggingABI, signer);

    try {
        const tx = await contract.logEvent(batchOrSerialId, eventType, details, supplyNumber);
        await tx.wait();
        alert(`Event logged for: ${batchOrSerialId}`);
    } catch (error) {
        console.error("Error logging event:", error);
    }
}

export async function getEvents(batchOrSerialId) {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(eventLoggingAddress, eventLoggingABI, signer);

    try {
        const events = await contract.getEvents(batchOrSerialId);
        console.log("Events for:", batchOrSerialId, events);
        return events;
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

//UPDATE THIS TO JUST VIEW
export async function verifyDrug(serialNumber) {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(drugVerificationAddress, drugVerificationABI, signer);

    try {
        const tx = await contract.verifyDrug(serialNumber);
        await tx.wait();
        alert(`Drug verified: ${serialNumber}`);
    } catch (error) {
        console.error("Error verifying drug:", error);
    }
}

export async function flagDrug(serialNumber) {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(drugVerificationAddress, drugVerificationABI, signer);

    try {
        const tx = await contract.flagDrug(serialNumber);
        await tx.wait();
        alert(`Drug flagged as faulty: ${serialNumber}`);
    } catch (error) {
        console.error("Error flagging drug:", error);
    }
}

export async function isDrugVerified(serialNumber) {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(drugVerificationAddress, drugVerificationABI, signer);

    try {
        const verified = await contract.isDrugVerified(serialNumber);
        console.log(`Drug ${serialNumber} verified status:`, verified);
        return verified;
    } catch (error) {
        console.error("Error checking drug verification:", error);
    }
}

export async function isDrugFlagged(serialNumber) {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(drugVerificationAddress, drugVerificationABI, signer);

    try {
        const flagged = await contract.isDrugFlagged(serialNumber);
        console.log(`Drug ${serialNumber} flagged status:`, flagged);
        return flagged;
    } catch (error) {
        console.error("Error checking drug flagged status:", error);
    }
}

// UI interaction for displaying drug details
function displayDrugDetails(details) {
    const [batchId, currentOwner, isVerified, isBatchFaulty, supplyNumber] = details;
    // Update your HTML to display these details on the web app
    document.getElementById("drugDetails").innerHTML = `
        <p>Batch ID: ${batchId}</p>
        <p>Current Owner: ${currentOwner}</p>
        <p>Is Verified: ${isVerified}</p>
        <p>Is Batch Faulty: ${isBatchFaulty}</p>
        <p>Supply Number: ${supplyNumber}</p>
    `;
}

//Should be boolean
export async function isOwner(serialNumber) {
  const signer = await connectToMetaMask();
  if (!signer) return;

  // Get contract instance with signer
  const contract = new ethers.Contract(drugTrackingAddress, drugTrackingABI, signer);

  try {
      // Call the isOwner function to check ownership
      const ownerStatus = await contract.isOwner(serialNumber);
      console.log(`Ownership status for drug ${serialNumber}:`, ownerStatus);

      // Inform the user if they are the owner
      if (ownerStatus) {
          alert(`You are the owner of the drug with serial number: ${serialNumber}`);
      } else {
          alert(`You are NOT the owner of the drug with serial number: ${serialNumber}`);
      }

      return ownerStatus;
  } catch (error) {
      console.error("Error checking ownership:", error);
  }
}

//Mark drug as faulty --> Entire batch is faulty
export async function markDrugFaulty(serialNumber) {
  const signer = await connectToMetaMask();
  if (!signer) return;

  // Get contract instance with signer
  const contract = new ethers.Contract(drugTrackingAddress, drugTrackingABI, signer);

  try {
      // Send transaction to mark the drug (and batch) faulty
      const tx = await contract.markDrugFaulty(serialNumber);
      await tx.wait();  // Wait for transaction confirmation

      alert(`Drug and its batch marked as faulty: ${serialNumber}`);
  } catch (error) {
      console.error("Error marking drug faulty:", error);
  }
}
