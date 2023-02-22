// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "../contracts/NFT.sol";
import "../contracts/Token.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract MintAndStake is IERC721Receiver {
    Token public tokenContract;
    NFT public NFTContract;
    IERC721 public itemNFT;

    mapping(uint256 => address) public originalOwner;

    constructor(IERC721 _address) {
        itemNFT = _address;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        originalOwner[tokenId] = from;
        return IERC721Receiver.onERC721Received.selector;
    }

    function depositNFT(uint256 tokenId) external {
        itemNFT.safeTransferFrom(msg.sender, address(this), tokenId);
    }

    function withdrawNFT(uint256 tokenId) external {
        require(originalOwner[tokenId] == msg.sender, "Not original owner!");
        itemNFT.safeTransferFrom(address(this), msg.sender, tokenId);
    }
}
