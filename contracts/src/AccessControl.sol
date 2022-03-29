// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import './BaseRelayRecipient.sol';

contract AccessControl is OwnableUpgradeable, BaseRelayRecipient {
	mapping(address => bool) private _admins;
	event AdminAccessSet(address admin, bool enabled);

	function setAdminAccess(address admin, bool enabled) public onlyOwner {
		_admins[admin] = enabled;
		emit AdminAccessSet(admin, enabled);
	}

	function isAdmin(address admin) public view returns (bool) {
		return _admins[admin] || admin == owner();
	}

	modifier onlyAdmin() {
		require(isAdmin(_msgSender()), 'Caller is not admin');
		_;
	}

	/**
	 * return the sender of this call.
	 * if the call came through our trusted forwarder, return the original sender.
	 * otherwise, return `msg.sender`.
	 * should be used in the contract anywhere instead of msg.sender
	 */
	function _msgSender()
		internal
		view
		virtual
		override(BaseRelayRecipient, ContextUpgradeable)
		returns (address ret)
	{
		return BaseRelayRecipient._msgSender();
	}

	function setTrustedForwarder(address _trustedForwarder) external onlyAdmin {
		trustedForwarder = _trustedForwarder;
	}
}
