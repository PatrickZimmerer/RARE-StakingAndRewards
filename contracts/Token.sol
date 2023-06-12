// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/*
 * @title Basic ERC20 contract where the controller contract can mint
 * @author Patrick Zimmerer
 * @notice Staking contract can mint new tokens
 * @dev the owner can withdraw the balance of the contract
 */
contract Token is ERC20Upgradeable, ERC20CappedUpgradeable, OwnableUpgradeable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;
    uint256 public constant STAKING_AMOUNT = 10 ether; // 10 tokens

    address internal STAKING_CONTRACT;

    function initialize(
        string memory _name,
        string memory _symbol,
        address _stakingContract
    ) public initializer {
        __ERC20_init(_name, _symbol);
        __ERC20Capped_init(MAX_SUPPLY);
        __Ownable_init();
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
    function _mint(
        address account,
        uint256 amount
    ) internal virtual override(ERC20Upgradeable, ERC20CappedUpgradeable) {
        super._mint(account, amount);
    }
}
