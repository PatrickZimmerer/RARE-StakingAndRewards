// SPDX-License-Identifier: MIT
// QUESTION: I always see people using Solidity 0.8.7 so what is the recommended version to use when creating a new contract?
pragma solidity 0.8.7;

import {ERC20Capped, ERC20} from "../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {Ownable} from "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract BasicERC20 is ERC20Capped, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10 ** 18;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) ERC20Capped(MAX_SUPPLY) {
        _mint(msg.sender, 1_000_000 * 10 ** uint256(decimals()));
    }

    function adminWithdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
