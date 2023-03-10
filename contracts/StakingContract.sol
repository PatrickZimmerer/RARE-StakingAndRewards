// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "../contracts/NFT.sol";
import "../contracts/Token.sol";
import "../contracts/IToken.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

// ERRORS FOUND WITH SLITHER:
// - some variables should've been constants
// - Token contract wasn't initialized
// - all withdraw methods use dangerous strict equality check
// - withdrawing nft uses a local variable never initialized (mapping => struct)
// - shouldn't use block.timestamp => whats a better alternative?

/*
 * @title A NFT Receiver contract used for staking that can mint ERC20 Tokens as reward
 * @author Patrick Zimmerer
 * @notice This contract can receive NFTs and mint erc20 tokens as a staking reward
 * @dev the NFT's can only be withdrawn by the original owner who deposited them
 */
contract StakingContract is IERC721Receiver, ERC165, Ownable {
    IToken private tokenContract;
    IERC721 private immutable NFT_CONTRACT;
    uint256 public constant STAKING_REWARD_PER_DAY = 10 ether;

    struct StakedNftStruct {
        address originalOwner;
        uint96 timestampOfDeposit;
    }

    // keeps track of which nft is staked by a) who & b) when was it deposited
    mapping(uint256 => StakedNftStruct) public nftsStaked;

    constructor(address _NftAddress) {
        require(
            ERC165(_NftAddress).supportsInterface(type(IERC721).interfaceId),
            "Contract is not ERC721"
        );
        NFT_CONTRACT = IERC721(_NftAddress);
    }

    function setTokenContract(address _tokenAddress) external onlyOwner {
        tokenContract = IToken(_tokenAddress);
    }

    /**
     * @notice Deposit your NFT to gain rewards
     * @param tokenId uint256 ID of the token to deposit
     */
    function depositNFT(uint256 tokenId) external {
        nftsStaked[tokenId] = StakedNftStruct(
            msg.sender,
            uint96(block.timestamp)
        );
        // Do not use safeTransferFrom because it will collude with onERC781Received function
        NFT_CONTRACT.transferFrom(msg.sender, address(this), tokenId);
    }

    /*
     * @title Basic receiver function from IERC721Receiver
     * @notice every time an NFT is received this gets triggered
     * @dev it's used to keep track of the staked nft
     */
    function onERC721Received(
        address from,
        address,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        NFT_CONTRACT.transferFrom(msg.sender, address(this), tokenId);
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
        delete nftsStaked[_tokenId]; // remove NFT from mapping
        NFT_CONTRACT.safeTransferFrom(address(this), _msgSender(), _tokenId);
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
        delete nftsStaked[_tokenId]; // remove NFT from mapping
        tokenContract.mint(_msgSender(), stakingReward);
        NFT_CONTRACT.safeTransferFrom(address(this), _msgSender(), _tokenId);
    }

    function getTokenContractAddress() external view returns (IToken) {
        return tokenContract;
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
