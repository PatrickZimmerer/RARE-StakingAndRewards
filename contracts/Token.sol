// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import {ERC20Capped, ERC20} from "../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {Ownable} from "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/*
 * @title Basic ERC20 contract where the controller contract can mint
 * @author Patrick Zimmerer
 * @notice admin and controller contract can mint new tokens
 * @dev the owner can withdraw the balance of the contract
 */
contract Token is ERC20Capped, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10 ** 18;

    constructor() ERC20("JustAToken", "JAT") ERC20Capped(MAX_SUPPLY) {
        _mint(msg.sender, 1_000_000 * 10 ** uint256(decimals()));
    }

    modifier onlyControllerContract() {
        // require(
        //     msg.sender = controllerContract,
        //     "only the controller contract can do that"
        // );
        _;
    }

    /*
     * @title Owner mint tokens
     * @author Patrick Zimmerer
     * @notice the owner can mint new tokens by his likings
     * @dev _amountInToken gets passed in by owner when calling the contract
     */
    function ownerMintNewTokens(uint256 _amountInToken) external onlyOwner {
        _mint(msg.sender, _amountInToken * 10 ** uint256(decimals()));
    }

    /*
     * @title Mint tokens for staking called by controlller contract
     * @author Patrick Zimmerer
     * @notice the controller contract can mint new tokens for staking
     * @dev _amountInToken gets passed in by controller contract
     */
    function stakingMint(
        uint256 _amountInToken
    ) external onlyControllerContract {
        _mint(msg.sender, _amountInToken * 10 ** uint256(decimals())); // decimals get added in here
    }

    /*
     * @title Basic withdraw function
     * @author Patrick Zimmerer
     * @notice every user can mint as many NFT as the maxSupply supplies
     * @dev the owner can withdraw the balance of the contract
     */
    function ownerWithdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
