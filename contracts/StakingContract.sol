// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "../contracts/NFT.sol";
import "../contracts/Token.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/*
 * @title A NFT Receiver contract used for staking that can mint ERC20 Tokens as reward
 * @author Patrick Zimmerer
 * @notice This contract can receive NFTs and mint erc20 tokens as a staking reward
 * @dev the NFT's can only be withdrawn by the original owner who deposited them
 */
contract StakingContract is IERC721Receiver, Ownable {
    Token public tokenContract;
    IERC721 public immutable nftContract;
    uint256 public STAKING_REWARD_PER_DAY = 10 ether;

    struct StakedNftStruct {
        address originalOwner;
        uint96 timestampOfDeposit;
    }

    // keeps track of which nft is staked by a) who & b) when was it deposited
    mapping(uint256 => StakedNftStruct) public nftsStaked;

    constructor(IERC721 _address) {
        nftContract = _address;
    }

    /*
     * @title Basic receiver function from IERC721Receiver
     * @notice every time an NFT is received this gets triggered
     * @dev it's used to keep track of the staked nft
     */
    function onERC721Received(
        address,
        address from,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        require(msg.sender == address(nftContract), "Not our NFT contract");
        nftsStaked[tokenId] = StakedNftStruct(from, uint96(block.timestamp));
        // if this returns something that makes _safeTransfers require revert,
        // does the mapping entry still persist or does that get reverted too?
        return IERC721Receiver.onERC721Received.selector;
    }

    /*
     * @title Basic withdraw function from staking contract
     * @notice can only be withdrawn by the original owner of the nft
     * @notice just withdraws the NFT
     * @notice USERS BE CAREFULL REWARDS WILL BE LOST IF NOT WITHDRAWN BEFORE
     */
    function withdrawNFT(uint256 _tokenId) external {
        require(
            nftsStaked[_tokenId].originalOwner == _msgSender(),
            "Not original owner!"
        );
        StakedNftStruct memory nullStruct;
        nftsStaked[_tokenId] = nullStruct; // remove NFT from mapping
        nftContract.safeTransferFrom(address(this), _msgSender(), _tokenId);
    }

    /*
     * @title Basic withdraw staking reward method from staking contract
     * @notice can only be withdrawn by the original owner of the nft
     * @notice just withdraws the staking reward
     */
    function withdrawStakingReward(uint256 _tokenId) external {
        require(
            nftsStaked[_tokenId].originalOwner == _msgSender(),
            "Not original owner!"
        );
        tokenContract.mint(_msgSender(), calculateStakingReward(_tokenId));
    }

    /*
     * @title Withdraw the staking reward and the NFT
     * @notice can only be withdrawn by the original owner of the nft
     * @notice withdraws the staking reward & the NFT in one transaction
     */
    function withdrawStakingRewardAndNFT(uint256 _tokenId) external {
        require(
            nftsStaked[_tokenId].originalOwner == _msgSender(),
            "Not original owner!"
        );
        uint256 stakingReward = calculateStakingReward(_tokenId);
        StakedNftStruct memory nullStruct;
        nftsStaked[_tokenId] = nullStruct; // remove NFT from mapping
        tokenContract.mint(_msgSender(), stakingReward);
        nftContract.safeTransferFrom(address(this), _msgSender(), _tokenId);
    }

    /*
     * @title Helper function to calculate the staking reward
     * @notice calculates staking reward for a specific NFT
     */
    function calculateStakingReward(
        uint256 _tokenId
    ) public view returns (uint256) {
        uint256 timePassed = block.timestamp -
            nftsStaked[_tokenId].timestampOfDeposit;
        return (timePassed * STAKING_REWARD_PER_DAY) / 1 days;
    }
}
