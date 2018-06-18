pragma solidity ^0.4.2;

contract testSmartContract {
    address   _owner;
    string   constant  _version = "0.0.1";
    uint8     _status;

    event statusChange(address indexed _adresse, uint8  _status );

    function testSmartContract(uint8 status) public {
        _owner = msg.sender;
        _status = status;
    }

    function get() public constant returns (address a ,uint8 b,string ) {
        return(_owner ,_status ,_version);
    }
    function getOwner() public constant returns (address owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        if(msg.sender != _owner) revert();
        _;
    }

    function getStatus() public constant returns (uint8 status) {
        status = _status;
    }

    function getVersion() public pure returns (string version) {
        return _version;
    }

    function setStatus(uint8 status) public {
        _status = status;
        statusChange(msg.sender, status);
    }

    function kill() public onlyOwner {
        selfdestruct(_owner);
    }
}
