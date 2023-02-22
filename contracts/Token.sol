// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
 * @title Basic ERC20 contract where the controller contract can mint
 * @author Patrick Zimmerer
 * @notice admin and controller contract can mint new tokens
 * @dev the owner can withdraw the balance of the contract
 */
contract Token is ERC20Capped, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;
    uint256 public constant STAKING_AMOUNT = 10 ether; // 10 tokens

    mapping(address => uint256) stakingWallet;

    constructor() ERC20("JustAToken", "JAT") ERC20Capped(MAX_SUPPLY) {
        ERC20._mint(msg.sender, 10_000 * 1 ether);
    }

    //TODO: Add function that checks if the smart contract thats calling a specific method is the
    //TODO: controller contract
    modifier onlyControllerContract() {
        require(true, "false");
        _;
    }

    /*
     * @title Staking wallet of the user who is staking Nfts gets increased by STAKING_AMOUNT tokens * the amount of nfts which are getting staked
     * @notice this can only be called by the controllerContract
     * @dev _nftsInStaking gets passed in by controller contract
     */
    function addStakingAmount(
        uint256 _nftsInStaking
    ) external onlyControllerContract {
        stakingWallet[msg.sender] += STAKING_AMOUNT * _nftsInStaking;
    }

    /*
     * @title Withdraws the amount of staked tokens a user has in his stakingWallet
     * @notice the controller contract can withdraw the staking rewards
     * @dev could be changed to only transfer a specific amount of the tokens but needs a require then
     */
    //TODO: currently sending it to the MintAndStake contract => tokens need to go to the staking user
    function stakingWithdraw() external onlyControllerContract {
        _mint(msg.sender, stakingWallet[msg.sender]);
    }

    /*
     * @title Admin withdraw function
     * @notice The admin can withdraw the balance of this contract
     */
    function ownerWithdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
