// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract SimpleStorage {
    uint256 favNumber;

    function store(uint256 newNum) public {
        favNumber = newNum;
    }

    function retrieve() public view returns(uint256) {
        return favNumber;
    }
}
