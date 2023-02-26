# Review of Patrick Zimmerer code for Week2

## General remarks

### Style guide

## Week2/exercise1/src/MyNFT-MerkleTree-presale.sol

Do we need to make maxSupply public? there is a function in ERC721 called totalSupply which would show us the same as maxSupply

```sol
uint256 public immutable maxSupply;
```

You can reduce those to uint16 in our case since we only provide 10 NFTs and a bunch of presales so uint16 would be sufficient I guess.

```sol
uint256 private constant MAX_INT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
uint256 private ticketGroup0 = MAX_INT;
uint256 private constant MAX_TICKETS = 6;
```

The MAX_INT here would be

```sol
uint16 private constant MAX_INT = 0xffff;
```

Defining constructor of Ownable which has no constructor

```sol
constructor(string memory _name, string memory _symbol, uint256 _maxSupply, bytes32 _merkleRoot, uint96 ownerRoyaltiesFees) Ownable() ERC721(_name, _symbol) {
```

The <= check is using more gas then just a < check so I guess since we can't mint more than one nft at a time < would be sufficient

```sol
require(_currentSupply <= maxSupply, "maxSupply hit");
```

Why are you returning the tokenId at the end of your mint function which is represented in \_currentSupply, should I do that too? :D

```sol
require(_currentSupply <= maxSupply, "maxSupply hit");
```

## Week2/exercise2/src/Game-ERC20-Token.sol

QUESTION: Why do you use a interface here and in the NFT not?

```sol
import { IERC20 } from "openzeppelin/token/ERC20/IERC20.sol";

interface IZGameToken is IERC20 {
    function mint(address to, uint256 amount) external;
}
```

## Week2/exercise2/src/Game-NFT-Collection.sol

Here you again made a Ownable() constructor which has no constructor so it's redundant, right?

```sol
constructor(
    string memory _name,
    string memory _symbol,
    uint256 _maxSupply
) Ownable() ERC721(_name, _symbol) {
    maxSupply = _maxSupply;
}
```

## Week2/exercise2/src/Game-Staking-Rewards.sol

Missing natspec comments for the overall contract

I realized when doing the ERC721Enumerable, that we both don't check, if the passed in contract is actually a IERC721 you could check that with ERC165 like this

```sol
contract SearchForPrimes is Ownable {
    using Math for uint256;
    IERC721Enumerable public contractToSearch;

    constructor(address _contractToSearch) {
        require(
            ERC165(_contractToSearch).supportsInterface(
                type(IERC721Enumerable).interfaceId
            ),
            "Contract is not ERC721Enumerable"
        );
        contractToSearch = IERC721Enumerable(_contractToSearch);
    }
```

so we can be sure it supports the functions we need and not just typecast it to our type as we did in our constructors like here, maybe we should add that question to our Questions docs :D

```sol
constructor(address _ZGameNFTCollectionContract) {
    ZGameNFTCollectionContract = IERC721(_ZGameNFTCollectionContract);
}
```

When you want to calculateRewards you did it like this which works just fine

```sol
function calculateRewards(
    uint256 depositTimestamp
) public view returns (uint256) {
    uint256 _timeSinceDeposit = block.timestamp - depositTimestamp;
    uint256 _calculatedRewards = (_timeSinceDeposit * 10 ether) / 1 days;
    return _calculatedRewards;
}
```

but I think it's better to pass in a tokenId and get that tokenId's timestamp from the mapping and compare it to the current block.timestamp
so it's more dynamic and if a user wants to read the infos from the contract he is able to do that without knowing when he deposited the token, here is my approach,
we should put this on our "ask jeffrey agenda" as well I think :D

```sol
function calculateStakingReward(
    uint256 _tokenId
) public view returns (uint256) {
    uint256 timePassed = block.timestamp -
        nftsStaked[_tokenId].timestampOfDeposit;
    return (timePassed * STAKING_REWARD_PER_DAY) / 1 days;
}
```

## Week2/exercise3/src/Enumerate-NFT.sol

maybe rename balanceOwner to be easier to understand balanceOfOwner maybe?
you don't need to do = 0 here since if you define a uint256 abc it gets initialized with its null value always so bool => false, uint => 0 etc.

```sol
uint256 balanceOwner = NFTContract.balanceOf(owner);
        uint256 primeNumbersBalance = 0;
```

In general this function is pretty long it would be more readable to split it up into seperate functions like in line 28 you could define tokenNumber and after that a function checkForPrimeNumber(tokenNumber) and then just put this whole code

```sol
 unchecked {
                uint256 stopVerify = tokenNumber / 2;
                // 1 is not considered a prime number
                if(tokenNumber == 1){
                    continue;
                }
                // set 2 and 3 as prime numbers
                if(tokenNumber < 3) {
                    primeNumbersBalance++;
                    continue;
                }
                if(tokenNumber % 2 == 0) {
                    // if even number, not a Prime
                    continue;
                }
                // Only the odd numbers need to be tested
                // Algorithm could be optimized for large numbers
                bool isPrime = true;
                for(uint256 j=3; j < stopVerify; j = j + 2) {
                    if(tokenNumber % j == 0) {
                        isPrime = false;
                        break;
                    }
                }
                if (isPrime == true) {
                    primeNumbersBalance++;
                }
            }
```

into another function to clean things up

---
