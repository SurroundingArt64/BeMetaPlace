// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import './AccessControl.sol';
import './interfaces/IBeMetaPlace.sol';
import './interfaces/IAccessControl.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract SecondarySale is
	AccessControl,
	ERC721HolderUpgradeable,
	ReentrancyGuardUpgradeable
{
	using SafeERC20 for IERC20;
	mapping(address => bool) public allowedNFTAddresses;
	mapping(address => bool) public allowedCurrencies;

	struct SaleData {
		address seller;
		address nftAddress;
		address currency;
		uint256 price;
		uint256 startTime;
		uint256 endTime;
		uint256 tokenId;
		bool isActive;
	}

	event SetNFT(address indexed nftAddress, bool isAllowed);

	event SetCurrencies(address indexed currencyAddress, bool isAllowed);

	function getIndex(address nftAddress, uint256 tokenId)
		public
		pure
		returns (bytes memory b)
	{
		b = abi.encode(nftAddress, tokenId);
	}

	function getData(bytes memory b)
		public
		pure
		returns (address nftAddress, uint256 tokenId)
	{
		(nftAddress, tokenId) = abi.decode(b, (address, uint256));
	}

	// user=>(address+tokenId)=>SaleData
	mapping(address => mapping(bytes => SaleData)) public sales;
	mapping(bytes => SaleData) public tokenSaleData;
	// user listings
	mapping(address => SaleData[]) public listings;

	// user listing index
	mapping(address => mapping(bytes => uint256)) public listingIndices;

	function initialize() public initializer {
		__Ownable_init();
		__ERC721Holder_init();
		__ReentrancyGuard_init();
	}

	function getListings(address seller)
		external
		view
		returns (SaleData[] memory listing)
	{
		listing = listings[seller];
	}

	function create(
		address nftAddress,
		address currency,
		string memory tokenURI_,
		uint256 amount,
		uint256 startTime,
		uint256 endTime
	) external {
		require(endTime > startTime, 'End time must be after start time');
		require(
			startTime > block.timestamp || startTime == 0,
			'End time must be after start time'
		);
		require(allowedNFTAddresses[nftAddress], 'NFTAddress not allowed');
		require(allowedCurrencies[currency], 'Currency not allowed');
		require(
			IAccessControl(nftAddress).isAdmin(address(this)),
			'Not allowed to mint'
		);
		require(
			IERC721(nftAddress).isApprovedForAll(_msgSender(), address(this)),
			'Set approval first'
		);

		uint256 tokenId = IBeMetaPlace(nftAddress).mint(_msgSender(), tokenURI_);

		SaleData memory data = SaleData({
			seller: _msgSender(),
			nftAddress: nftAddress,
			currency: currency,
			price: amount,
			startTime: startTime == 0 ? block.timestamp : startTime,
			endTime: endTime,
			tokenId: tokenId,
			isActive: true
		});

		listings[_msgSender()].push(data);
		uint256 _listingIndex = listings[_msgSender()].length - 1;

		listingIndices[_msgSender()][getIndex(nftAddress, tokenId)] = _listingIndex;
		sales[_msgSender()][getIndex(nftAddress, tokenId)] = data;
		tokenSaleData[getIndex(nftAddress, tokenId)] = data;
	}

	function updateListing(SaleData memory data) external {
		require(
			IERC721(data.nftAddress).ownerOf(data.tokenId) == _msgSender(),
			'Not allowed to update. Not owner.'
		);
		require(
			data.endTime > data.startTime &&
				(data.startTime == 0 || data.startTime > block.timestamp),
			'End time must be after start time'
		);
		require(allowedNFTAddresses[data.nftAddress], 'NFTAddress not allowed');
		require(allowedCurrencies[data.currency], 'Currency not allowed');
		uint256 _listingIndex = listingIndices[_msgSender()][
			getIndex(data.nftAddress, data.tokenId)
		];

		sales[_msgSender()][getIndex(data.nftAddress, data.tokenId)] = data;
		tokenSaleData[getIndex(data.nftAddress, data.tokenId)] = data;
		listings[_msgSender()][_listingIndex] = data;
	}

	function buy(address nftAddress, uint256 tokenId) external {
		require(allowedNFTAddresses[nftAddress], 'NFTAddress not allowed');
		bytes memory b = getIndex(nftAddress, tokenId);
		SaleData memory data = sales[_msgSender()][b];

		require(data.isActive, 'Sale is not active');
		require(
			data.startTime <= block.timestamp && block.timestamp <= data.endTime,
			'Sale is not active'
		);
		IERC721(nftAddress).safeTransferFrom(data.seller, _msgSender(), tokenId);
		IERC20(data.currency).transfer(data.seller, data.price);
		uint256 listingIndex = listingIndices[data.seller][b];

		listings[_msgSender()][listingIndex] = listings[_msgSender()][
			listings[_msgSender()].length - 1
		];
		listingIndices[data.seller][
			getIndex(
				listings[_msgSender()][listingIndex].nftAddress,
				listings[_msgSender()][listingIndex].tokenId
			)
		] = listingIndex;

		listings[_msgSender()].pop();

		delete sales[_msgSender()][b];
	}

	function cancel(address nftAddress, uint256 _tokenId) external {
		bytes memory b = getIndex(nftAddress, _tokenId);
		SaleData memory data = tokenSaleData[b];
		require(
			data.seller == _msgSender() || _msgSender() == owner(),
			'Not owner or seller.'
		);
		uint256 listingIndex = listingIndices[data.seller][b];

		listings[_msgSender()][listingIndex] = listings[_msgSender()][
			listings[_msgSender()].length - 1
		];
		listingIndices[data.seller][
			getIndex(
				listings[_msgSender()][listingIndex].nftAddress,
				listings[_msgSender()][listingIndex].tokenId
			)
		] = listingIndex;

		listings[_msgSender()].pop();

		delete sales[_msgSender()][b];
	}

	function setAllowedNFTAddress(address token, bool enabled) external {
		allowedNFTAddresses[token] = enabled;
		emit SetNFT(token, enabled);
	}

	function setAllowedCurrency(address token, bool enabled) external {
		allowedCurrencies[token] = enabled;
		emit SetCurrencies(token, enabled);
	}
}
