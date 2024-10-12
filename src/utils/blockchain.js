const { blockchain } = require('blockchain');

// Set up contract ABIs and deployed addresses
const drugTrackingABI = /* ABI from compiled DrugTracking.sol */;
const eventLoggingABI = /* ABI from compiled EventLogging.sol */;
const registrationABI = /* ABI from compiled Registration.sol */;
const verificationABI = /* ABI from compiled DrugVerification.sol */;

const drugTrackingAddress = "0xDrugTrackingContractAddress";  // Replace with actual deployed address
const eventLoggingAddress = "0xEventLoggingContractAddress";  // Replace with actual deployed address
const registrationAddress = "0xRegistrationContractAddress";  // Replace with actual deployed address
const verificationAddress = "0xVerificationContractAddress";  // Replace with actual deployed address

// Connect to MetaMask and return a signer
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
}

// Interact with the DrugTracking contract
async function getDrugDetails(serialNumber) {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const drugTrackingContract = new ethers.Contract(drugTrackingAddress, drugTrackingABI, signer);
    try {
        const drugDetails = await drugTrackingContract.getDrugDetails(serialNumber);
        console.log("Drug Details: ", drugDetails);
        // You can update the front-end UI with the returned drugDetails
        displayDrugDetails(drugDetails);
    } catch (error) {
        console.error("Error fetching drug details:", error);
    }
}

// Interact with the EventLogging contract to log an event
async function logEvent(batchOrSerialId, eventType, details, supplyNumber) {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const eventLoggingContract = new ethers.Contract(eventLoggingAddress, eventLoggingABI, signer);
    try {
        const tx = await eventLoggingContract.logEvent(batchOrSerialId, eventType, details, supplyNumber);
        await tx.wait();
        console.log("Event logged successfully!");
    } catch (error) {
        console.error("Error logging event:", error);
    }
}

// Register a new stakeholder using the Registration contract
async function registerStakeholder(address, role) {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const registrationContract = new ethers.Contract(registrationAddress, registrationABI, signer);
    try {
        const tx = await registrationContract.registerStakeholder(address, role);
        await tx.wait();
        console.log("Stakeholder registered successfully!");
    } catch (error) {
        console.error("Error registering stakeholder:", error);
    }
}

// Verify a batch using the DrugVerification contract
async function verifyBatch(batchId) {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const verificationContract = new ethers.Contract(verificationAddress, verificationABI, signer);
    try {
        const tx = await verificationContract.verifyBatch(batchId);
        await tx.wait();
        console.log("Batch verified successfully!");
    } catch (error) {
        console.error("Error verifying batch:", error);
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
