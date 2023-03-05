const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Token", () => {
    let token;
    let deployer;
    let account1;
    let nftContract;
    let stakingContract;

    const NFT_NAME = "TestNFT";
    const NFT_SYMBOL = "TNF";
    const TOKEN_NAME = "TestToken";
    const TOKEN_SYMBOL = "TET";

    const MAX_SUPPLY = 11;
    const PRICE = ethers.utils.parseEther("0.0001");
    const SMALL_AMOUNT_OF_ETH = ethers.utils.parseEther("0.0001");

    beforeEach(async () => {
        [deployer, account1] = await ethers.getSigners();

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
        token = await TokenFactory.deploy(
            TOKEN_NAME,
            TOKEN_SYMBOL,
            stakingContract.address
        );
        await token.deployed();
    });
    describe("constructor", () => {
        it("should deploy to an address", async () => {
            expect(await stakingContract.address).to.not.be.null;
            expect(await stakingContract.address).to.be.ok;
            expect(await token.address).to.not.be.null;
            expect(await token.address).to.be.ok;
        });
        it("should set the name, symbol and staking contract address when deployed", async () => {
            expect(await token.name()).to.equal(TOKEN_NAME);
            expect(await token.symbol()).to.equal(TOKEN_SYMBOL);
            expect(await token.STAKING_CONTRACT).to.equal(
                stakingContract.addrress
            );
        });
    });
    describe("mint", () => {
        xit("should mint the given amount of tokens because the stakingContract called that", async () => {
            const signer = await ethers.provider.getSigner(
                stakingContract.address
            );
            // console.log(signer);
            const tx = await token
                .connect(signer)
                .mint(account1.address, BigNumber.from("10"));
            await tx.wait();
            let userBalance = await token.balanceOf(account1.address);
            expect(userBalance).eq(
                BigNumber.from(ethers.utils.parseEther("10"))
            );

            const tx2 = await token
                .connect(signer)
                .mint(account1.address, BigNumber.from("100"));
            await tx2.wait();
            userBalance = await token.balanceOf(account1.address);
            expect(userBalance).eq(BigNumber.from("110"));
        });
        it("should revert since the caller is not the stakingContract", async () => {
            await expect(
                token
                    .connect(account1)
                    .mint(account1.address, BigNumber.from("10"))
            ).to.be.revertedWith("Only the staking contract can do this.");
        });
    });
});
