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

    const BIG_0 = BigNumber.from("0");
    const BIG_1 = BigNumber.from("1");
    const MAX_SUPPLY = 11;
    const PRICE = ethers.utils.parseEther("0.0001");
    const SMALL_AMOUNT_OF_ETH = ethers.utils.parseEther("0.0001");
    const TINY_AMOUNT_OF_ETH = ethers.utils.parseEther("0.0000001");

    beforeEach(async () => {
        [deployer, account1] = await ethers.getSigners();

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
    describe("mint", () => {
        it("should mint an nft to a given address and increase the tokenSupply", async () => {
            const tx = await nft.mint(account1.address, { value: PRICE });
            await tx.wait();
            let userBalance = await nft.balanceOf(account1.address);
            expect(userBalance).eq(BIG_1);

            const tx2 = await nft.mint(account1.address, { value: PRICE });
            await tx2.wait();
            userBalance = await nft.balanceOf(account1.address);
            expect(userBalance).eq(BigNumber.from("2"));
            expect(await nft.tokenSupply()).eq(BigNumber.from("3"));
        });
        it("should revert the eleventh mint since MAX_SUPPLY is reached", async () => {
            let i = 0;
            while (i < 10) {
                let tx = await nft.mint(account1.address, { value: PRICE });
                await tx.wait();
                i++;
            }
            expect(await nft.tokenSupply()).eq(BigNumber.from("11"));
            await expect(
                nft.mint(account1.address, { value: PRICE })
            ).to.be.revertedWith("Max Supply reached.");
        });
        it("should revert since the value sent is not correct", async () => {
            await expect(
                nft.mint(account1.address, {
                    value: PRICE.sub(TINY_AMOUNT_OF_ETH),
                })
            ).to.be.revertedWith("Not enough ETH sent.");
        });
        it("should revert since the address sent to is not an ERC721Receiver", async () => {
            await expect(
                nft.mint(nft.address, {
                    value: PRICE,
                })
            ).to.be.revertedWith(
                "ERC721: transfer to non ERC721Receiver implementer"
            );
        });
    });
    describe("ownerWithdraw", () => {
        it("should allow the owner to withdraw the balance of the contract", async () => {
            const startingBalance = await ethers.provider.getBalance(
                deployer.address
            );
            const buyTx = await nft.connect(account1).mint(account1.address, {
                value: PRICE,
            });
            await buyTx.wait();
            const contractBalance = await ethers.provider.getBalance(
                nft.address
            );
            expect(contractBalance).eq(PRICE);
            const withdrawTx = await nft.ownerWithdraw();
            withdrawTx.wait();
            expect(await ethers.provider.getBalance(nft.address)).eq(BIG_0);
            const endingBalance = startingBalance.add(PRICE);

            expect(
                await ethers.provider.getBalance(deployer.address)
            ).to.be.closeTo(endingBalance, SMALL_AMOUNT_OF_ETH);
        });
        it("should revert the ownerWithdraw since caller is not owner", async () => {
            await expect(
                nft.connect(account1).ownerWithdraw()
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
    describe("_baseURI", () => {
        it("should return the correct base URI when called through ERC721s tokenURI", async () => {
            const tx = await nft.mint(account1.address, { value: PRICE });
            await tx.wait();
            const baseURI = await nft.tokenURI(BIG_1);
            expect(baseURI).eq(
                `ipfs://QmX597cEg8LCFbND2YwFsFd7SmiSr8sNQq1GWyKv7u3tYR/${BigNumber.from(
                    "1"
                )}`
            );
        });
        it("should revert since tokenId has not been minted yet", async () => {
            await expect(nft.tokenURI(BIG_1)).to.be.revertedWith(
                "ERC721: invalid token ID"
            );
        });
    });
    describe("viewBalance", () => {
        it("should return the correct balance of the contract before and after minting an NFT", async () => {
            let balance = await ethers.provider.getBalance(nft.address);
            let expectedBalance = await nft.viewBalance();
            expect(balance).eq(BIG_0);
            expect(balance).eq(expectedBalance);

            let tx = await nft.mint(account1.address, { value: PRICE });
            await tx.wait();
            balance = await ethers.provider.getBalance(nft.address);
            expectedBalance = await nft.viewBalance();
            expect(balance).eq(PRICE);
            expect(balance).eq(expectedBalance);

            tx = await nft.mint(account1.address, { value: PRICE });
            await tx.wait();
            balance = await ethers.provider.getBalance(nft.address);
            expectedBalance = await nft.viewBalance();
            const tokenSupply = await nft.tokenSupply();
            expect(balance).eq(PRICE.mul(tokenSupply.sub(BIG_1)));
            expect(balance).eq(expectedBalance);

            tx = await nft.ownerWithdraw();
            await tx.wait();
            balance = await ethers.provider.getBalance(nft.address);
            expectedBalance = await nft.viewBalance();
            expect(balance).eq(BIG_0);
            expect(balance).eq(expectedBalance);
        });
    });
    describe("totalSupply", () => {
        it("should return the correct total supply", async () => {
            let totalSupply = await nft.totalSupply();
            // minus one since we start at tokenSupply 1 and go to 11 => 10
            expect(totalSupply).eq(MAX_SUPPLY - 1);
        });
    });
});
