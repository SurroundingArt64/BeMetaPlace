// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import '@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import './AccessControl.sol';

contract PrimarySale is AccessControl, ERC721HolderUpgradeable {
	IERC721 nft721;

	function initialize(address _nft721_address) public initializer {
		__ERC721Holder_init();
		__Ownable_init();

		nft721 = IERC721(_nft721_address);
	}

	function sale(uint256 tokenId) external onlyAdmin {}

	uint256[50] private __gap;
}
