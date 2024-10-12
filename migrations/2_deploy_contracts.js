const DrugTracking = artifacts.require("DrugTracking");
const EventLogging = artifacts.require("EventLogging");
const DrugVerification = artifacts.require("DrugVerification");

module.exports = function (deployer) {
  deployer.deploy(DrugTracking);
  deployer.deploy(EventLogging);
  deployer.deploy(DrugVerification);
};
