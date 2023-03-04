const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Token", () => {
    let token;
    let deployer;
    let account1;

    const NAME = "Test Token";
    const SYMBOL = "TEST";
    const STAKING_CONTRACT = "0xe4064d8E292DCD971514972415664765e51B5364";

    const MAX_SUPPLY = 11;
    const PRICE = ethers.utils.parseEther("0.0001");
    const SMALL_AMOUNT_OF_ETH = ethers.utils.parseEther("0.0001");

    beforeEach(async () => {
        [depl, acc1] = await ethers.getSigners();

        deployer = depl;
        account1 = acc1;
        const TokenFactory = await ethers.getContractFactory("Token");
        console.log(STAKING_CONTRACT);
        token = await TokenFactory.deploy(NAME, SYMBOL, STAKING_CONTRACT);
        await token.deployed();
    });
    describe("constructor", () => {
        it("should deploy to an address", async () => {
            expect(await token.address).to.not.be.null;
            expect(await token.address).to.be.ok;
        });
        it("should set the name, symbol and staking contract address when deployed", async () => {
            expect(await token.name()).to.equal(NAME);
            expect(await token.symbol()).to.equal(SYMBOL);
            expect(await token.STAKING_CONTRACT).to.equal(STAKING_CONTRACT);
        });
    });
});
