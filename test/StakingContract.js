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

    const NFT_CONTRACT_ADDRESS = "0xe4064d8E292DCD971514972415664765e51B5364";

    const STAKING_REWARD_PER_DAY = BigNumber.from("10");

    const SMALL_AMOUNT_OF_ETH = ethers.utils.parseEther("0.0001");

    beforeEach(async () => {
        [depl, acc1] = await ethers.getSigners();

        deployer = depl;
        account1 = acc1;
        const StakingContractFactory = await ethers.getContractFactory(
            "StakingContract"
        );
        stakingContract = await StakingContractFactory.deploy(
            NFT_CONTRACT_ADDRESS
        );
        console.log("test");
        await stakingContract.deployed();
    });
    describe("constructor", () => {
        it("should deploy to an address", async () => {
            expect(await stakingContract.address).to.not.be.null;
            expect(await stakingContract.address).to.be.ok;
        });
        it("should set the nftContract on deployment", async () => {
            //TODO add nft contract address
        });
    });
});
