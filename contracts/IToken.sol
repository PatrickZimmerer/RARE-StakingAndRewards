// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

/**
 * @dev Interface of the Token contract created by Patrick Zimmerer.
 */
interface IToken {
    function mint(address _to, uint256 _amount) external;

    function ownerWithdraw() external;

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint8);

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function getInterfaceId() external view returns (bytes4);
}
