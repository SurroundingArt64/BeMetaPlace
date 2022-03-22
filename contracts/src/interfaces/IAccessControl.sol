// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface IAccessControl {
	function isAdmin(address admin) external view returns (bool);
}
