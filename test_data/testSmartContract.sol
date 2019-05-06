pragma solidity ^0.5.4;

contract testSmartContract {
    address   _owner;
    string   constant  _version = "0.0.1";
    uint8     _status;

    event statusChange(address indexed _adresse, uint8  _status );

    constructor(uint8 status) public {
        _owner = msg.sender;
        _status = status;
    }

    function get() public view returns (address a ,uint8 b,string memory) {
        return(_owner ,_status ,_version);
    }
    function getOwner() public view returns (address owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        if(msg.sender != _owner) revert();
        _;
    }

    function getStatus() public view returns (uint8 status) {
        status = _status;
    }

    function getVersion() public pure returns (string memory version) {
        return _version;
    }

    function pay() public payable {
        
    }

    function setStatus(uint8 status) public {
        _status = status;
        emit statusChange(msg.sender, status);
    }

}
