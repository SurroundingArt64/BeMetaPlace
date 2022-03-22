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
		address seller;
		uint256 listingIndex;
	}

	mapping(uint256 => Sale) public sales;
	mapping(address => uint256[]) public listings;

	function getListings(address seller)
		external
		view
		returns (uint256[] memory listing)
	{
		listing = listings[seller];
	}

	function getSales(address seller)
		external
		view
		returns (Sale[] memory saleArr)
	{
		uint256[] memory listing = listings[seller];
		saleArr = new Sale[](listing.length);

		for (uint256 index = 0; index < listing.length; index++) {
			saleArr[index] = sales[listing[index]];
		}
	}

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

		uint256 _tokenId = nft721.mint(address(this), _uri);

		listings[_msgSender()].push(_tokenId);

		sales[_tokenId] = Sale({
			price: price,
			startAt: block.timestamp,
			endAt: block.timestamp + duration,
			tokenAddress: tokenAddress,
			seller: _msgSender(),
			listingIndex: listings[_msgSender()].length - 1
		});
	}

	function buy(uint256 _tokenId) external {
		Sale memory sale = sales[_tokenId];

		require(sale.startAt <= block.timestamp, 'Sale has not started yet.');
		require(sale.endAt >= block.timestamp, 'Sale has already ended.');

		IERC20(sale.tokenAddress).safeTransferFrom(
			_msgSender(),
			sale.seller,
			sale.price
		);

		IERC721(address(nft721)).safeTransferFrom(
			address(this),
			_msgSender(),
			_tokenId
		);
		// swap with last and delete

		// get the last tokenId
		uint256 lastTokenId = listings[sale.seller][
			listings[sale.seller].length - 1
		];

		// update the current with last
		listings[sale.seller][sale.listingIndex] = listings[sale.seller][
			listings[sale.seller].length - 1
		];
		// update the swapped with current index
		sales[lastTokenId].listingIndex = sale.listingIndex;

		// pop the last
		delete sales[_tokenId];

		// set listing index for last value
		listings[sale.seller].pop();
	}

	function setAllowedERC20(address token, bool enabled) external {
		allowedERC20Tokens[token] = enabled;
	}

	uint256[50] private __gap;
}
