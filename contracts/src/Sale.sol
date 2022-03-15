// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import '@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './AccessControl.sol';
import './interfaces/IBeMetaPlace.sol';

contract PrimarySale is AccessControl, ERC721HolderUpgradeable {
	using SafeERC20 for IERC20;
	IBeMetaPlace nft721;

	mapping(address => bool) public allowedERC20Tokens;

	struct Sale {
		uint256 price;
		uint256 startAt;
		uint256 endAt;
		address tokenAddress;
		address buyer;
		uint256 listingIndex;
	}

	mapping(uint256 => Sale) public sales;
	mapping(address => uint256[]) public listings;

	function initialize(address _nft721_address) public initializer {
		__ERC721Holder_init();
		__Ownable_init();

		nft721 = IBeMetaPlace(_nft721_address);
	}

	function create(
		string memory _uri,
		address tokenAddress,
		uint256 duration,
		uint256 price
	) external onlyAdmin {
		require(allowedERC20Tokens[tokenAddress], 'Not allowed token');

		uint256 _tokenId = nft721.mint(_msgSender(), _uri);

		listings[_msgSender()].push(_tokenId);

		sales[_tokenId] = Sale({
			price: price,
			startAt: block.timestamp,
			endAt: block.timestamp + duration,
			tokenAddress: tokenAddress,
			buyer: address(0),
			listingIndex: listings[_msgSender()].length - 1
		});
	}

	function buy(uint256 _tokenId) external {
		Sale memory sale = sales[_tokenId];

		require(sale.startAt <= block.timestamp, 'Sale has not started yet.');
		require(sale.endAt >= block.timestamp, 'Sale has already ended.');

		delete sales[_tokenId];

		IERC20(sale.tokenAddress).safeTransferFrom(
			_msgSender(),
			sale.buyer,
			sale.price
		);

		// swap with last and delete
		uint256 lastValue = listings[sale.buyer][listings[sale.buyer].length - 1];
		listings[sale.buyer][sale.listingIndex] = lastValue;
		listings[sale.buyer].pop();
	}

	uint256[50] private __gap;
}