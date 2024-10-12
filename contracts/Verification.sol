// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DrugVerification {
    mapping(string => bool) public verifiedBatches;
    mapping(string => bool) public flaggedBatches;
    mapping(string => bool) public verifiedDrugs;
    mapping(string => bool) public flaggedDrugs;

    event BatchVerified(string batchId, bool isVerified);
    event BatchFlagged(string batchId, bool isFlagged);
    event DrugFlagged(string serialNumber, bool isFlagged);
    event SupplyNumberAlert(string batchId, uint256 incorrectSupplyNumber);

    modifier drugExists(string memory _serialNumber) {
        require(verifiedDrugs[_serialNumber] || flaggedDrugs[_serialNumber], "Drug not found");
        _;
    }

    modifier batchExists(string memory _batchId) {
        require(verifiedBatches[_batchId] || flaggedBatches[_batchId], "Batch not found");
        _;
    }

    function verifyBatch(string memory _batchId) public {
        verifiedBatches[_batchId] = true;
        emit BatchVerified(_batchId, true);
    }

    function flagBatch(string memory _batchId) public {
        flaggedBatches[_batchId] = true;
        emit BatchFlagged(_batchId, true);
    }

    function flagDrug(string memory _serialNumber) public drugExists(_serialNumber) {
        flaggedDrugs[_serialNumber] = true;
        emit DrugFlagged(_serialNumber, true);
    }

    function isBatchVerified(string memory _batchId) public view batchExists(_batchId) returns (bool) {
        return verifiedBatches[_batchId];
    }

    function isBatchFlagged(string memory _batchId) public view batchExists(_batchId) returns (bool) {
        return flaggedBatches[_batchId];
    }

    function isDrugFlagged(string memory _serialNumber) public view drugExists(_serialNumber) returns (bool) {
        return flaggedDrugs[_serialNumber];
    }

    function alertSupplyNumberDiscrepancy(string memory _batchId, uint256 _incorrectSupplyNumber) public {
        // Trigger an alert if there is a supply number discrepancy
        emit SupplyNumberAlert(_batchId, _incorrectSupplyNumber);
    }
}