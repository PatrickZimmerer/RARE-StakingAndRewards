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
contract MintAndStake is IERC721Receiver, Ownable {
    Token public tokenContract;
    NFT public NFTContract;
    IERC721 public immutable itemNFT;

    struct StakedNftStruct {
        address originalOwner;
        uint256 timestampOfDeposit;
    }

    // keeps track of which nft is staked by a) who & b) when was it deposited
    mapping(uint256 => StakedNftStruct) public nftsStaked;

    constructor(IERC721 _address) {
        itemNFT = _address;
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
        nftsStaked[tokenId] = StakedNftStruct(from, block.timestamp);
        return IERC721Receiver.onERC721Received.selector;
    }

    /*
     * @title Basic deposit function for staking
     * @notice a user can deposit the NFT to get staking rewards
     */
    function depositNFT(uint256 _tokenId) external {
        itemNFT.safeTransferFrom(_msgSender(), address(this), _tokenId);
        nftsStaked[_tokenId] = StakedNftStruct(_msgSender(), block.timestamp);
    }

    /*
     * @title Basic withdraw function from staking contract
     * @notice can only be withdrawn by the original owner of the nft
     */
    function withdrawNFT(uint256 _tokenId) external {
        require(
            nftsStaked[_tokenId].originalOwner == _msgSender(),
            "Not original owner!"
        );
        itemNFT.safeTransferFrom(address(this), _msgSender(), _tokenId);
    }
}
