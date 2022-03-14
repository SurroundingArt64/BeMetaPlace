// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface IBeMetaPlace {
	function mint(address to_, string memory tokenURI_) external;

	function setTokenURI(uint256 tokenId, string memory _tokenURI) external;
}
