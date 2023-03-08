# Mutation testing report

Number of mutations: 27
Killed: 22 / 27

Mutations:
Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/Token.sol
Line nr: 28
Result: Killed
Original line:
msg.sender == STAKING_CONTRACT,

    Mutated line:
                     msg.sender != STAKING_CONTRACT,

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/Token.sol
Line nr: 28
Result: Killed
Original line:
msg.sender == STAKING_CONTRACT,

    Mutated line:
                     msg.sender != STAKING_CONTRACT,

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/Token.sol
Line nr: 13
Result: Equivalent
Original line:
uint256 public constant MAX_SUPPLY = 100_000_000 \* 10 \*\* 18;

    Mutated line:
             uint256 public constant MAX_SUPPLY = 100_000_000 / 10 ** 18;

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/Token.sol
Line nr: 39
Result: Killed
Original line:
\_mint(\_to, \_amount);

    Mutated line:

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/Token.sol
Line nr: 22
Result: Equivalent
Original line:
) ERC20(\_name, \_symbol) ERC20Capped(MAX_SUPPLY) {

    Mutated line:
             )  ERC20Capped(MAX_SUPPLY) {

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/Token.sol
Line nr: 22
Result: Equivalent
Original line:
) ERC20(\_name, \_symbol) ERC20Capped(MAX_SUPPLY) {

    Mutated line:
             ) ERC20(_name, _symbol)  {

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/Token.sol
Line nr: 38
Result: Killed
Original line:
function mint(address \_to, uint256 \_amount) external onlyStakingContract {

    Mutated line:
             function mint(address _to, uint256 _amount) external  {

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/NFT.sol
Line nr: 31
Result: Killed
Original line:
require(\_tokenSupply < MAX_SUPPLY, "Max Supply reached.");

    Mutated line:
                 require(_tokenSupply <= MAX_SUPPLY, "Max Supply reached.");

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/NFT.sol
Line nr: 32
Result: Killed
Original line:
require(msg.value == PRICE, "Not enough ETH sent.");

    Mutated line:
                 require(msg.value != PRICE, "Not enough ETH sent.");

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/NFT.sol
Line nr: 31
Result: Killed
Original line:
require(\_tokenSupply < MAX_SUPPLY, "Max Supply reached.");

    Mutated line:
                 require(_tokenSupply >= MAX_SUPPLY, "Max Supply reached.");

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/NFT.sol
Line nr: 32
Result: Killed
Original line:
require(msg.value == PRICE, "Not enough ETH sent.");

    Mutated line:
                 require(msg.value != PRICE, "Not enough ETH sent.");

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/NFT.sol
Line nr: 37
Result: Killed
Original line:
\_safeMint(\_to, \_tokenSupply - 1);

    Mutated line:
                 _safeMint(_to, _tokenSupply + 1);

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/NFT.sol
Line nr: 53
Result: Killed
Original line:
return MAX_SUPPLY - 1; // token supply starts at 1

    Mutated line:
                 return MAX_SUPPLY + 1; // token supply starts at 1

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/NFT.sol
Line nr: 37
Result: Killed
Original line:
\_safeMint(\_to, \_tokenSupply - 1);

    Mutated line:

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/NFT.sol
Line nr: 22
Result: Equivalent
Original line:
) ERC721(\_name, \_symbol) {}

    Mutated line:
             )  {}

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/NFT.sol
Line nr: 44
Result: Killed
Original line:
function ownerWithdraw() external onlyOwner {

    Mutated line:
             function ownerWithdraw() external  {

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/StakingContract.sol
Line nr: 88
Result: Killed
Original line:
nftsStaked[_tokenId].originalOwner == \_msgSender(),

    Mutated line:
                     nftsStaked[_tokenId].originalOwner != _msgSender(),

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/StakingContract.sol
Line nr: 102
Result: Killed
Original line:
nftsStaked[_tokenId].originalOwner == \_msgSender(),

    Mutated line:
                     nftsStaked[_tokenId].originalOwner != _msgSender(),

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/StakingContract.sol
Line nr: 115
Result: Killed
Original line:
nftsStaked[_tokenId].originalOwner == \_msgSender(),

    Mutated line:
                     nftsStaked[_tokenId].originalOwner != _msgSender(),

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/StakingContract.sol
Line nr: 88
Result: Killed
Original line:
nftsStaked[_tokenId].originalOwner == \_msgSender(),

    Mutated line:
                     nftsStaked[_tokenId].originalOwner != _msgSender(),

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/StakingContract.sol
Line nr: 102
Result: Killed
Original line:
nftsStaked[_tokenId].originalOwner == \_msgSender(),

    Mutated line:
                     nftsStaked[_tokenId].originalOwner != _msgSender(),

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/StakingContract.sol
Line nr: 115
Result: Killed
Original line:
nftsStaked[_tokenId].originalOwner == \_msgSender(),

    Mutated line:
                     nftsStaked[_tokenId].originalOwner != _msgSender(),

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/StakingContract.sol
Line nr: 136
Result: Killed
Original line:
uint256 timePassed = block.timestamp -

    Mutated line:
                 uint256 timePassed = block.timestamp + nftsStaked[_tokenId].timestampOfDeposit;

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/StakingContract.sol
Line nr: 138
Result: Killed
Original line:
return (timePassed \* STAKING_REWARD_PER_DAY) / 1 days;

    Mutated line:
                 return (timePassed * STAKING_REWARD_PER_DAY) * 1 days;

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/StakingContract.sol
Line nr: 138
Result: Killed
Original line:
return (timePassed \* STAKING_REWARD_PER_DAY) / 1 days;

    Mutated line:
                 return (timePassed / STAKING_REWARD_PER_DAY) / 1 days;

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/StakingContract.sol
Line nr: 39
Result: Equivalent
Original line:
ERC165(\_NftAddress).supportsInterface(type(IERC721).interfaceId),

    Mutated line:
                     ERC165(_NftAddress).supportsInterface(interfaceId),

Mutation:
File: /Users/patrickzimmerer/Desktop/Rare/Code/StakingAndRewards/contracts/StakingContract.sol
Line nr: 45
Result: Killed
Original line:
function setTokenContract(address \_tokenAddress) external onlyOwner {

    Mutated line:
             function setTokenContract(address _tokenAddress) external  {
