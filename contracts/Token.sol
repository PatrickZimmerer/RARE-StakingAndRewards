// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
 * @title Basic ERC20 contract where the controller contract can mint
 * @author Patrick Zimmerer
 * @notice Staking contract can mint new tokens
 * @dev the owner can withdraw the balance of the contract
 */
contract Token is ERC20Capped, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;
    uint256 public constant STAKING_AMOUNT = 10 ether; // 10 tokens

    address internal immutable STAKING_CONTRACT;

    constructor(
        string memory _name,
        string memory _symbol,
        address _stakingContract
    ) ERC20(_name, _symbol) ERC20Capped(MAX_SUPPLY) {
        STAKING_CONTRACT = _stakingContract;
    }

    modifier onlyStakingContract() {
        require(
            msg.sender == STAKING_CONTRACT,
            "Only the staking contract can do this."
        );
        _;
    }

    /*
     * @title Staking contract can call this function when someone want's to withdraw his staking funds
     * @notice this can only be called by the staking contract
     */
    function mint(address _to, uint256 _amount) external onlyStakingContract {
        _mint(_to, _amount);
    }
}
