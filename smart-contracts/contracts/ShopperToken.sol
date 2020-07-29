pragma solidity ^0.6.8;

import './Administration.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

/** @title Decentramall shopper token (MALL)
  * @notice MALL follows an ERC20 implementation that can be minted/burned
  * @dev Mint/burn controlled by the Marketplace.sol contract
  */

contract ShopperToken is ERC20, Administration {

    address private _marketplace;

    event SetMarketplace(address marketplace);

    modifier legitimateMarketplace {
        require(msg.sender == _marketplace, "Not a legitimate marketplace!");
        _;
    }

    function setMarketplace(address marketplace) external onlyAdmin {
        _marketplace = marketplace;
        emit SetMarketplace(marketplace);
    }

    function mint(address account, uint256 amount) external override legitimateMarketplace{
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) external override legitimateMarketplace {
        _burn(_msgSender(), amount);
    }
}