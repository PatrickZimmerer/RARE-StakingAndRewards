const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("NFT", () => {
    let nft;
    let deployer;
    let account1;

    const NAME = "TestNFT";
    const SYMBOL = "TNF";

    const MAX_SUPPLY = 11;
    const PRICE = ethers.utils.parseEther("0.0001");
    const SMALL_AMOUNT_OF_ETH = ethers.utils.parseEther("0.0001");

    beforeEach(async () => {
        [depl, acc1] = await ethers.getSigners();
        deployer = depl;
        account1 = acc1;

        const NFTFactory = await ethers.getContractFactory("NFT");
        nft = await NFTFactory.deploy(NAME, SYMBOL);
        await nft.deployed();
    });
    describe("constructor", () => {
        it("should deploy to an address", async () => {
            expect(await nft.address).to.not.be.null;
            expect(await nft.address).to.be.ok;
        });
        it("should set the selling fee, name and symbol when deployed", async () => {
            expect(await nft.name()).to.equal(NAME);
            expect(await nft.symbol()).to.equal(SYMBOL);
        });
    });
});
