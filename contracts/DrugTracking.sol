// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DrugTracking {
    
    struct Batch {
        string batchId;
        bool isFaulty;
        uint256 supplyNumber;
        address manufacturer;
        uint256 manufactureDate;
        uint256 expirationDate;
    }
    
    struct Drug {
        string serialNumber;
        string batchId;
        address currentOwner;
        address[] previousOwners;
        bool isVerified;
    }

    mapping(string => Batch) public batches; 
    mapping(string => Drug) public drugs;
    mapping(string => string[]) public batchToDrugs;
    mapping(string => address[]) public drugHistory;

    event BatchCreated(string batchId, address indexed manufacturer, uint256 supplyNumber);
    event DrugCreated(string serialNumber, string batchId, address indexed owner);
    event DrugTransferred(string serialNumber, address indexed newOwner);
    event BatchMarkedFaulty(string batchId);
    event SupplyNumberAlert(string batchId, uint256 incorrectSupplyNumber);

    modifier onlyBatchExists(string memory _batchId) {
        require(batches[_batchId].manufacturer != address(0), "Batch does not exist");
        _;
    }

    modifier onlyOwner(string memory _serialNumber) {
        require(drugs[_serialNumber].currentOwner == msg.sender, "Not the current owner");
        _;
    }

    modifier drugExists(string memory _serialNumber) {
        require(drugs[_serialNumber].currentOwner != address(0), "Drug does not exist");
        _;
    }

    function createBatch(
        string memory _batchId, 
        uint256 _supplyNumber, 
        uint256 _manufactureDate, 
        uint256 _expirationDate
    ) public {
        require(batches[_batchId].manufacturer == address(0), "Batch already exists");
        batches[_batchId] = Batch({
            batchId: _batchId,
            isFaulty: false,
            supplyNumber: _supplyNumber,
            manufacturer: msg.sender,
            manufactureDate: _manufactureDate,
            expirationDate: _expirationDate
        });

        emit BatchCreated(_batchId, msg.sender, _supplyNumber);
    }

    function createDrug(
        string memory _serialNumber,
        string memory _batchId
    ) public onlyBatchExists(_batchId) {
        require(drugs[_serialNumber].currentOwner == address(0), "Drug already exists");

        address[] memory emptyArray;
        drugs[_serialNumber] = Drug({
            serialNumber: _serialNumber,
            batchId: _batchId,
            currentOwner: msg.sender,
            previousOwners: emptyArray,
            isVerified: false
        });
        batchToDrugs[_batchId].push(_serialNumber);
        drugHistory[_serialNumber].push(msg.sender);
        emit DrugCreated(_serialNumber, _batchId, msg.sender);
    }

    function transferDrug(string memory _serialNumber, address _newOwner, uint _supplyNumber) public onlyOwner(_serialNumber) {
        Drug storage drug = drugs[_serialNumber];
        Batch memory batch = batches[drug.batchId];

        if (batch.supplyNumber != _supplyNumber) {
            emit SupplyNumberAlert(drug.batchId, _supplyNumber);
            return;
        }
        drug.previousOwners.push(drug.currentOwner);
        drug.currentOwner = _newOwner;
        drugHistory[_serialNumber].push(_newOwner);

        emit DrugTransferred(_serialNumber, _newOwner);
    }

    function markBatchFaulty(string memory _batchId) public onlyBatchExists(_batchId) {
        batches[_batchId].isFaulty = true;
        emit BatchMarkedFaulty(_batchId);

        for (uint i = 0; i < batchToDrugs[_batchId].length; i++) {
            string memory drugSerial = batchToDrugs[_batchId][i];
            drugs[drugSerial].isVerified = false; 
        }
    } 

    function getDrugDetails(string memory _serialNumber) public view drugExists(_serialNumber) returns (
        string memory batchId,
        address currentOwner,
        bool isVerified,
        bool isBatchFaulty,
        uint256 supplyNumber
    ) {
        Drug memory drug = drugs[_serialNumber];
        Batch memory batch = batches[drug.batchId];
        return (drug.batchId, drug.currentOwner, drug.isVerified, batch.isFaulty, batch.supplyNumber);
    }

    function getDrugHistory(string memory _serialNumber) public view drugExists(_serialNumber) returns (address[] memory) {
        return drugHistory[_serialNumber];
    }

    function verifyDrug(string memory _serialNumber) public drugExists(_serialNumber) {
        drugs[_serialNumber].isVerified = true;
    }

}