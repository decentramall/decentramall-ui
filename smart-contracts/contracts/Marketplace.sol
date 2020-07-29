pragma solidity ^0.6.8;

import './Administration.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';

contract Marketplace is Administration {
    using SafeMath for uint256;

    ShopperToken token;

    event SetToken(address tokenAddress);

    struct Product {
        uint256 productId;
        uint256 price; //In ether
        uint256 priceRatio; //e.g. 50 == 50% discount || 80 = 20% discount
        uint256 storeId; //Id of space token
    }

    constructor (ShopperToken tokenAddress) external onlyAdmin {
        token = tokenAddress;
        emit SetToken(address(tokenAddress));
    }
}