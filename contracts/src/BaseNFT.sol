// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/IBeMetaFactory.sol';
import './interfaces/IBeMetaPlace.sol';

contract BaseNFT is ERC721URIStorage, Ownable, IBeMetaPlace {
	using Counters for Counters.Counter;
	address immutable FACTORY;

	Counters.Counter _tokenCounters;

	constructor(
		string memory name_,
		string memory symbol_,
		address owner_
	) ERC721(name_, symbol_) {
		FACTORY = msg.sender;
		_transferOwnership(owner_);
	}

	function setTokenURI(uint256 tokenId, string memory _tokenURI)
		external
		override
		onlyOwner
	{
		_setTokenURI(tokenId, _tokenURI);
	}

	function mint(address to_, string memory tokenURI_)
		external
		override
		returns (uint256 _tokenId)
	{
		require(
			IBeMetaFactory(FACTORY).isSecondarySale(_msgSender()) ||
				_msgSender() == owner(),
			'Only secondary sale or owner can create token'
		);

		_tokenCounters.increment();
		_tokenId = _tokenCounters.current();

		_mint(to_, _tokenId);
		_setTokenURI(_tokenId, tokenURI_);
	}

	function _isApprovedOrOwner(address spender, uint256 tokenId)
		internal
		view
		virtual
		override
		returns (bool)
	{
		require(_exists(tokenId), 'ERC721: operator query for nonexistent token');
		return
			super._isApprovedOrOwner(spender, tokenId) ||
			IBeMetaFactory(FACTORY).isSecondarySale(_msgSender()) ||
			_msgSender() == FACTORY;
	}
}
