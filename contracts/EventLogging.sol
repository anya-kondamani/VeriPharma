// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventLogging {
    struct Event {
        string batchOrSerialId;
        string eventType;
        address eventOwner;
        uint256 timestamp;
        string details;
        uint256 supplyNumber;
    }

    mapping(string => Event[]) public eventsLog;

    event EventLogged(string batchOrSerialId, string eventType, address indexed eventOwner, uint256 timestamp, string details, uint256 supplyNumber);

    function logEvent(string memory _batchOrSerialId, string memory _eventType, string memory _details, uint256 _supplyNumber) public {
        Event memory newEvent = Event({
            batchOrSerialId: _batchOrSerialId,
            eventType: _eventType,
            eventOwner: msg.sender,
            timestamp: block.timestamp,
            details: _details,
            supplyNumber: _supplyNumber
        });
        eventsLog[_batchOrSerialId].push(newEvent);
        emit EventLogged(_batchOrSerialId, _eventType, msg.sender, block.timestamp, _details, _supplyNumber);
    }

    function getEvents(string memory _batchOrSerialId) public view returns (Event[] memory) {
        return eventsLog[_batchOrSerialId];
    }
    
}