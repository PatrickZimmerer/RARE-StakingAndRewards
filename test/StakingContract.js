const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("StakingContract", () => {
    let stakingContract;
    let deployer;
    let account1;
    let tokenContract;
    let nftContract;

    const NFT_NAME = "TestNFT";
    const NFT_SYMBOL = "TNF";
    const TOKEN_NAME = "TestToken";
    const TOKEN_SYMBOL = "TET";
    const MAX_SUPPLY = BigNumber.from("100000000");

    const STAKING_REWARD_PER_DAY = BigNumber.from("10");

    const SMALL_AMOUNT_OF_ETH = ethers.utils.parseEther("0.0001");

    beforeEach(async () => {
        [depl, acc1] = await ethers.getSigners();
        deployer = depl;
        account1 = acc1;

        const NFTFactory = await ethers.getContractFactory("NFT");
        nftContract = await NFTFactory.deploy(NFT_NAME, NFT_SYMBOL);
        const StakingContractFactory = await ethers.getContractFactory(
            "StakingContract"
        );
        stakingContract = await StakingContractFactory.deploy(
            nftContract.address
        );
        await stakingContract.deployed();
        const TokenFactory = await ethers.getContractFactory("Token");
        tokenContract = await TokenFactory.deploy(
            TOKEN_NAME,
            TOKEN_SYMBOL,
            stakingContract.address
        );

        const tx = await stakingContract.setTokenContract(
            tokenContract.address
        );
        await tx.wait();
    });
    describe("constructor", () => {
        it("should deploy to an address", async () => {
            expect(await stakingContract.address).to.not.be.null;
            expect(await stakingContract.address).to.be.ok;
            expect(await tokenContract.address).to.not.be.null;
            expect(await tokenContract.address).to.be.ok;
            expect(await nftContract.address).to.not.be.null;
            expect(await nftContract.address).to.be.ok;
        });
        it("should set the nftContract on deployment", async () => {
            //TODO add nft contract address
        });
    });
});
