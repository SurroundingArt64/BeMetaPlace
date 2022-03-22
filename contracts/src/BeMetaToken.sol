// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import './AccessControl.sol';

contract BeMetaToken is ERC20Upgradeable, AccessControl {
	function initialize(string memory name_, string memory symbol_)
		external
		initializer
	{
		__ERC20_init(name_, symbol_);
		__Ownable_init();

		_mint(owner(), 100_000 ether);
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
