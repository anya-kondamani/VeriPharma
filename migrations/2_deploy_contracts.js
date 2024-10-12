const Registration = artifacts.require("Registration");
const DrugTracking = artifacts.require("DrugTracking");
const EventLogging = artifacts.require("EventLogging");
const DrugVerification = artifacts.require("DrugVerification");

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function deployWithRetry(deployer, contract, retries = 5, initialDelay = 30000) {
    let currentTry = 0;
    while (currentTry < retries) {
        try {
            await deployer.deploy(contract);
            console.log(`Successfully deployed ${contract.contractName}`);
            return;
        } catch (error) {
            console.log(`Deployment of ${contract.contractName} failed. Retrying...`);
            currentTry++;
            await delay(initialDelay * Math.pow(2, currentTry - 1)); // Exponential backoff
        }
    }
    throw new Error(`Failed to deploy ${contract.contractName} after ${retries} attempts`);
}

module.exports = function (deployer) {
    deployer.then(async () => {
        await deployWithRetry(deployer, Registration);
        await deployWithRetry(deployer, DrugTracking);
        await deployWithRetry(deployer, EventLogging);
        await deployWithRetry(deployer, DrugVerification);
    });
};