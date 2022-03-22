// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol';

import './AccessControl.sol';
import './interfaces/IBeMetaPlace.sol';

contract BeMetaPlace is
	ERC721URIStorageUpgradeable,
	ERC721EnumerableUpgradeable,
	AccessControl,
	IBeMetaPlace
{
	using CountersUpgradeable for CountersUpgradeable.Counter;
	CountersUpgradeable.Counter private _tokenCounters;

	string __baseName;

	function initialize(string memory name_, string memory symbol_)
		public
		initializer
	{
		__ERC721URIStorage_init();
		__ERC721_init(name_, symbol_);
		__Ownable_init();
	}

	function mint(address to_, string memory tokenURI_)
		public
		override
		onlyAdmin
		returns (uint256 _tokenId)
	{
		_tokenCounters.increment();
		_tokenId = _tokenCounters.current();

		_mint(to_, _tokenId);

		_setTokenURI(_tokenId, tokenURI_);
	}

	function setTokenURI(uint256 tokenId, string memory _tokenURI)
		public
		override
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

	function setBase(string memory base_name) external onlyAdmin {
		__baseName = base_name;
	}

	function _baseURI() internal view virtual override returns (string memory) {
		return __baseName;
	}

	function tokenURI(uint256 tokenId)
		public
		view
		override(ERC721URIStorageUpgradeable, ERC721Upgradeable)
		returns (string memory _tokenURI)
	{
		return ERC721URIStorageUpgradeable.tokenURI(tokenId);
	}

	function supportsInterface(bytes4 interfaceId)
		public
		view
		virtual
		override(ERC721EnumerableUpgradeable, ERC721Upgradeable)
		returns (bool)
	{
		return
			ERC721EnumerableUpgradeable.supportsInterface(interfaceId) ||
			ERC721Upgradeable.supportsInterface(interfaceId) ||
			super.supportsInterface(interfaceId);
	}

	function _burn(uint256 tokenId)
		internal
		virtual
		override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
	{
		ERC721URIStorageUpgradeable._burn(tokenId);
	}

	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId
	) internal virtual override(ERC721EnumerableUpgradeable, ERC721Upgradeable) {
		ERC721EnumerableUpgradeable._beforeTokenTransfer(from, to, tokenId);
	}

	uint256[50] private __gap;
}
