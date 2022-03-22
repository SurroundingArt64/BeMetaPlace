// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface IBeMetaFactory {
	function isSecondarySale(address addr) external view returns (bool);
}
