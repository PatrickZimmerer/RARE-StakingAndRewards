// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFT is ERC721 {
    using Strings for uint256;
    uint256 public tokenSupply = 1;
    uint256 public constant MAX_SUPPLY = 6;
    uint256 public constant PRICE = 0.0001 ether;

    mapping(uint256 => address) private _owners;
    mapping(address => mapping(address => bool)) private _operators;

    address immutable deployer;

    constructor() ERC721("SimpleNFT", "SIT") {
        deployer = _msgSender();
    }

    function mint() external payable {
        uint256 _tokenSupply = tokenSupply; // added local variable to reduce gas cost
        require(_tokenSupply < MAX_SUPPLY, "Max supply reached");
        require(msg.value == PRICE, "Not enough ETH sent");
        _mint(_msgSender(), _tokenSupply);
        unchecked {
            _tokenSupply++; // added unchecked block since overflow check gets handled by require MAX_SUPPLY
        }
        tokenSupply = _tokenSupply;
        _owners[_tokenSupply] = _msgSender();
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public override {
        require(_owners[_tokenId] != address(0), "Token does not exist");
        require(_owners[_tokenId] == _from, "Can't transfer from non-owner");
        require(
            _msgSender() == _from || _operators[_from][_msgSender()],
            "Required to be owner or operator"
        );
        _owners[_tokenId] = _to;
        _transfer(_from, _to, _tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmZNUR9J4cNFXBMv3E7Ng9DfPuP3RxYgDiMUqvTKd1St5L/";
    }

    function viewBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() external {
        payable(deployer).transfer(address(this).balance);
    }

    function totalSupply() external pure returns (uint256) {
        return MAX_SUPPLY - 1; // token supply starts at 1
    }
}
