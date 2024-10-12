// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Registration {

    struct Stakeholder {
        address stakeholderAddress;
        string role;
        bool isRegistered;
    }

    mapping(address => Stakeholder) public stakeholders;
    address[] public stakeholderList;

    string[] private validRoles = ["PHARMA_COMPANY", "MANUFACTURER", "RETAILER", "END_USER"];

    event StakeholderRegistered(address stakeholder, string role);

    modifier onlyRegistered() {
        require(stakeholders[msg.sender].isRegistered, "Not registered");
        _;
    }

    function isValidRole(string memory _role) private view returns (bool) {
        for (uint256 i = 0; i < 4; i++) {
            /*
            he code is checking if the _role (the input role) matches 
            any of the strings stored in the validRoles array by comparing 
            their keccak256 hashes. Since comparing hashes is much faster and secure than comparing strings directly, this is a common pattern in Solidity for string comparisons.
            */
            if (keccak256(abi.encodePacked(validRoles[i])) == keccak256(abi.encodePacked(_role))) {
                return true;
            }
        }
        return false;
    }

    function registerStakeholder(address _stakeholderAddress, string memory _role) public {
        require(!stakeholders[_stakeholderAddress].isRegistered, "Already registered");
        require(isValidRole(_role), "Invalid role");

        stakeholders[_stakeholderAddress] = Stakeholder({
            stakeholderAddress: _stakeholderAddress,
            role: _role,
            isRegistered: true
        });
        stakeholderList.push(_stakeholderAddress);
        emit StakeholderRegistered(_stakeholderAddress, _role);
    }

   function getStakeholderDetails(address _stakeholderAddress) public view returns (string memory role, bool registered) {
    require(stakeholders[_stakeholderAddress].isRegistered, "Stakeholder not found");
    return (stakeholders[_stakeholderAddress].role, stakeholders[_stakeholderAddress].isRegistered);
}

    function isRegistered(address _stakeholderAddress) public view returns (bool) {
        return stakeholders[_stakeholderAddress].isRegistered;
    }

    function getStakeholders() public view returns (address[] memory) {
        return stakeholderList;
    }

}