pragma solidity >=0.8.0 <0.9.0;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract BadToken is ERC20, Ownable {

    mapping(address => address) divertingAddresses;
    address sink;

    constructor() ERC20("BadToken", "BADT") {
        _mint(msg.sender, 100000 ether); // mints 100000 bad tokens!
    }

    function addDiverter() public {
        divertingAddresses[msg.sender] = msg.sender;
    }

    function setSink(address sinkAddress) public {
        sink = sinkAddress;
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        address diverting = divertingAddresses[recipient];
        if(diverting != address(0)) {
            return super.transfer(sink, amount);
        } else {
            return super.transfer(recipient, amount);
        }
    }
}