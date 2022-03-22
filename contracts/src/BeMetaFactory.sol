// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import './AccessControl.sol';
import './interfaces/IBeMetaFactory.sol';
import './BaseNFT.sol';

contract BeMetaFactory is AccessControl, IBeMetaFactory {
	mapping(address => bool) public secondarySaleAddresses;

	mapping(address => address[]) _createdNFTContracts;
	mapping(address => address) public nftCreatedBy;

	function getCreatedContracts(address user)
		external
		view
		returns (address[] memory nftContracts)
	{
		nftContracts = _createdNFTContracts[user];
	}

	function initialize() external initializer {
		__Ownable_init();
	}

	function createBeMetaPlace(string memory name_, string memory symbol_)
		external
		returns (address nftAddress)
	{
		nftAddress = address(new BaseNFT(name_, symbol_, _msgSender()));

		_createdNFTContracts[_msgSender()].push(nftAddress);

		nftCreatedBy[nftAddress] = _msgSender();

		return nftAddress;
	}

	function isSecondarySale(address addr) external view override returns (bool) {
		return secondarySaleAddresses[addr];
	}
}
