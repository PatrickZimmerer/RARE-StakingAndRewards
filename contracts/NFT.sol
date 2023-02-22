// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    uint256 public tokenSupply = 1;
    uint256 public constant MAX_SUPPLY = 6;
    uint256 public constant PRICE = 0.0001 ether;

    address immutable deployer;

    constructor() ERC721("SimpleNFT", "SIT") {
        deployer = msg.sender;
    }

    function mint() external payable {
        uint256 _tokenSupply = tokenSupply; // added local variable to reduce gas cost
        require(_tokenSupply < MAX_SUPPLY, "Max supply reached");
        require(msg.value == PRICE, "Not enough ETH sent");
        _mint(msg.sender, _tokenSupply);
        unchecked {
            _tokenSupply++; // added unchecked block since overflow check gets handled by require MAX_SUPPLY
        }
        tokenSupply = _tokenSupply;
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
