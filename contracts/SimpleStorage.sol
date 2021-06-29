// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract SimpleStorage {
  uint storedData;

  event NumberChanged(uint);
  
  function set(uint x) public {
    storedData = x;
    emit NumberChanged(x);
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
