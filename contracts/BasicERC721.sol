// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyToken is ERC721 {
    uint256 public tokenSupply = 0;
    uint256 public constant MAX_SUPPLY = 5;
    uint256 public constant PRICE = 0.001 ether;

    address immutable deployer;

    constructor() ERC721("SimpleNFT", "SIT") {
        deployer = msg.sender;
    }

    function mint() external payable {
        require(tokenSupply < MAX_SUPPLY, "Max supply reached");
        require(msg.value == PRICE, "Not enough ETH sent");
        _mint(msg.sender, tokenSupply);
        tokenSupply++;
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
}
