// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import './AccessControl.sol';

contract BeMetaFactory is AccessControl {
	function initialize() external initializer {
		__Ownable_init();
	}
}
