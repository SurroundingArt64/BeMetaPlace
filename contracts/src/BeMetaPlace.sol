// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol';

import './AccessControl.sol';

contract BeMetaPlace is ERC721URIStorageUpgradeable, AccessControl {
	using CountersUpgradeable for CountersUpgradeable.Counter;

	CountersUpgradeable.Counter private _tokenCounters;

	function initialize(string memory name_, string memory symbol_)
		public
		initializer
	{
		__ERC721URIStorage_init();
		__ERC721_init(name_, symbol_);
		__Ownable_init();
	}

	function mint(address to_, string memory tokenURI_) public onlyAdmin {
		_tokenCounters.increment();
		uint256 _tokenId = _tokenCounters.current();

		_mint(to_, _tokenId);

		_setTokenURI(_tokenId, tokenURI_);
	}

	function setTokenURI(uint256 tokenId, string memory _tokenURI)
		public
		onlyAdmin
	{
		_setTokenURI(tokenId, _tokenURI);
	}

	function _msgSender()
		internal
		view
		virtual
		override(AccessControl, ContextUpgradeable)
		returns (address ret)
	{
		return BaseRelayRecipient._msgSender();
	}
}
