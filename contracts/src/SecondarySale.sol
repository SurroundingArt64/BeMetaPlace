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

	////////////////////////////////////////////
	////        			 										  ////
	////             MAPPINGS 			        ////
	////        			 										  ////
	////////////////////////////////////////////

	mapping(address => bool) public allowedNFTAddresses;
	mapping(address => bool) public allowedCurrencies;
	// user=>(address+tokenId)=>SaleData
	mapping(address => mapping(bytes => SaleData)) public sales;
	// (address+tokenId)=>SaleData
	mapping(bytes => SaleData) public tokenSaleData;
	// user listings
	mapping(address => SaleData[]) public listings;
	// user listing index
	mapping(address => mapping(bytes => uint256)) public listingIndices;

	////////////////////////////////////////////
	////        			 										  ////
	////              STRUCTS 		          ////
	////        			 										  ////
	////////////////////////////////////////////

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

	////////////////////////////////////////////
	////        			 										  ////
	////              EVENTS  			        ////
	////        			 										  ////
	////////////////////////////////////////////

	event SetNFT(address indexed nftAddress, bool isAllowed);
	event SetCurrencies(address indexed currencyAddress, bool isAllowed);
	event Sale(
		address indexed seller,
		address indexed nftAddress,
		address indexed currency,
		uint256 price,
		uint256 startTime,
		uint256 endTime,
		uint256 tokenId,
		bool isActive
	);
	event Updated(
		address indexed seller,
		address indexed nftAddress,
		address indexed currency,
		uint256 price,
		uint256 startTime,
		uint256 endTime,
		uint256 tokenId,
		bool isActive
	);
	event Sold(address indexed seller, uint256 tokenId);
	event Cancelled(address indexed seller, uint256 tokenId);

	////////////////////////////////////////////
	////        			 										  ////
	////               INIT   			        ////
	////        			 										  ////
	////////////////////////////////////////////

	function initialize() public initializer {
		__Ownable_init();
		__ERC721Holder_init();
		__ReentrancyGuard_init();
	}

	////////////////////////////////////////////
	////        			 										  ////
	////          GETTERS/SETTERS	          ////
	////        			 										  ////
	////////////////////////////////////////////

	function getListings(address seller)
		external
		view
		returns (SaleData[] memory listing)
	{
		listing = listings[seller];
	}

	function setAllowedNFTAddress(address token, bool enabled) external {
		allowedNFTAddresses[token] = enabled;
		emit SetNFT(token, enabled);
	}

	function setAllowedCurrency(address token, bool enabled) external {
		allowedCurrencies[token] = enabled;
		emit SetCurrencies(token, enabled);
	}

	////////////////////////////////////////////
	////        			 										  ////
	////               CORE  		  	        ////
	////        			 										  ////
	////////////////////////////////////////////

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
		emit Sale(
			_msgSender(),
			nftAddress,
			currency,
			amount,
			startTime == 0 ? block.timestamp : startTime,
			endTime,
			tokenId,
			true
		);
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

		emit Updated(
			data.seller,
			data.nftAddress,
			data.currency,
			data.price,
			data.startTime,
			data.endTime,
			data.tokenId,
			data.isActive
		);
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

		emit Sold(_msgSender(), tokenId);
	}

	function cancel(address nftAddress, uint256 _tokenId) external onlyAdmin {
		bytes memory b = getIndex(nftAddress, _tokenId);
		SaleData memory data = tokenSaleData[b];

		require(
			data.seller == _msgSender() || _msgSender() == owner(),
			'Not owner or seller.'
		);

		// Get current listing
		uint256 listingIndex = listingIndices[data.seller][b];

		// Rewrite current listing with last listing
		// @dev ! THIS FAILS WITH UNDERFLOW?
		listings[_msgSender()][listingIndex] = listings[_msgSender()][
			listings[_msgSender()].length - 1
		];

		// Update listing index
		listingIndices[data.seller][b] = listingIndex;

		// Delete sale data
		delete sales[_msgSender()][b];

		// Remove last listing
		listings[_msgSender()].pop();

		// Emit Cancelled Event
		emit Cancelled(_msgSender(), _tokenId);
	}

	////////////////////////////////////////////
	////        			 										  ////
	////               UTILS  			        ////
	////        			 										  ////
	////////////////////////////////////////////

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
}
