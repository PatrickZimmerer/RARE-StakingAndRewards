// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/*
 * @title A Basic NFT contract
 * @author Patrick Zimmerer
 * @notice This contract can mint NFTs
 * @dev and all of the basic ERC721 features
 */
contract NFT is
    Initializable,
    UUPSUpgradeable,
    ERC721Upgradeable,
    OwnableUpgradeable
{
    using Strings for uint256;
    uint256 public tokenSupply;
    uint256 private constant MAX_SUPPLY = 11;
    uint256 public constant PRICE = 0.0001 ether;

    function initialize(
        string memory _name,
        string memory _symbol
    ) public initializer {
        __ERC721_init(_name, _symbol);
        __Ownable_init();
        __UUPSUpgradeable_init();
        tokenSupply = 1;
    }

    /*
     * @title Basic minting function
     * @notice every user can mint as many NFTs until the maxSupply is reached
     * @dev calls the _safeMint method to avoid sending NFTs to non ERC721Receiver contracts
     */
    function mint(address _to) external payable {
        uint256 _tokenSupply = tokenSupply; // added local variable to reduce gas cost (amount of READs)
        require(_tokenSupply < MAX_SUPPLY, "Max Supply reached.");
        require(msg.value == PRICE, "Not enough ETH sent.");
        unchecked {
            _tokenSupply++; // added unchecked block since overflow check gets handled by require MAX_SUPPLY
        }
        tokenSupply = _tokenSupply;
        _safeMint(_to, _tokenSupply - 1);
    }

    function _authorizeUpgrade(
        address _newImplementation
    ) internal override onlyOwner {}

    /*
     * @title Admin withdraw function
     * @notice The admin can withdraw the balance of this contract
     */
    function ownerWithdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function viewBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function totalSupply() external pure returns (uint256) {
        return MAX_SUPPLY - 1; // token supply starts at 1
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmX597cEg8LCFbND2YwFsFd7SmiSr8sNQq1GWyKv7u3tYR/";
    }
}
