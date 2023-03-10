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

    const BIG_0 = BigNumber.from("0");
    const BIG_1 = BigNumber.from("1");

    const PRICE = ethers.utils.parseEther("0.0001");

    beforeEach(async () => {
        [deployer, account1] = await ethers.getSigners();
        const NFTFactory = await ethers.getContractFactory("NFT");
        nftContract = await NFTFactory.deploy(NFT_NAME, NFT_SYMBOL);
        await nftContract.deployed();
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
        await tokenContract.deployed();

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
        it("should revert deployment since the passed in contract is not ERC721", async () => {
            const StakingContractFactory = await ethers.getContractFactory(
                "StakingContract"
            );
            await expect(
                StakingContractFactory.deploy(tokenContract.address)
            ).to.be.revertedWith(
                "function selector was not recognized and there's no fallback function"
            );
        });
    });
    describe("setTokenContract", () => {
        it("should revert since the caller is not the owner", async () => {
            await expect(
                stakingContract
                    .connect(account1)
                    .setTokenContract(tokenContract.address)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("should set a new token contract address", async () => {
            const NewContractFactory = await ethers.getContractFactory("ERC20");
            const newContract = await NewContractFactory.deploy(
                TOKEN_NAME,
                TOKEN_SYMBOL
            );
            let setTx = await stakingContract.setTokenContract(
                newContract.address
            );
            await setTx.wait();
            expect(await stakingContract.getTokenContractAddress()).eq(
                newContract.address
            );
        });
    });
    describe("onERC721Received", () => {
        beforeEach(async () => {
            const tx = await nftContract.mint(deployer.address, {
                value: PRICE,
            });
            await tx.wait();
            await nftContract.approve(stakingContract.address, BIG_1);
        });
        it("should revert since the caller is not the owner of the NFT", async () => {
            await expect(
                stakingContract
                    .connect(account1)
                    .onERC721Received(
                        deployer.address,
                        stakingContract.address,
                        BIG_1,
                        "0x"
                    )
            ).to.be.revertedWith("ERC721: transfer from incorrect owner");
        });
        it("should deposit the NFT to our nftsStaked mapping", async () => {
            expect(await nftContract.balanceOf(stakingContract.address)).eq(
                BIG_0
            );
            expect(await nftContract.balanceOf(deployer.address)).eq(BIG_1);
            const tx = await stakingContract.depositNFT(BIG_1);
            await tx.wait();
            const nftsStakedToken1 = await stakingContract.nftsStaked(BIG_1);
            expect(nftsStakedToken1.originalOwner).to.be.equal(
                deployer.address
            );
            expect(await nftContract.balanceOf(stakingContract.address)).eq(
                BIG_1
            );
            expect(await nftContract.balanceOf(deployer.address)).to.be.equal(
                BIG_0
            );
        });
        it("should return when called", async () => {
            const tx = await stakingContract.callStatic.onERC721Received(
                ethers.constants.AddressZero,
                ethers.constants.AddressZero,
                BIG_1,
                "0x"
            );
            console.log(tx);
            expect(tx).to.equal("0x150b7a02");
        });
    });
    describe("withdrawNFT", () => {
        beforeEach(async () => {
            // before each withdraw it mints a token and approves the stakingContract to handle the NFT
            const tx = await nftContract.mint(deployer.address, {
                value: PRICE,
            });
            await tx.wait();
            await nftContract.approve(stakingContract.address, BIG_1);
        });
        it("should deposit and withdraw since the caller is the original owner", async () => {
            const sendTx = await stakingContract.depositNFT(BIG_1);
            await sendTx.wait();
            expect(await nftContract.balanceOf(deployer.address)).to.be.equal(
                BIG_0
            );
            await stakingContract.withdrawNFT(BIG_1);
            expect(await nftContract.balanceOf(deployer.address)).to.be.equal(
                BIG_1
            );
            const nftsStakedToken1 = await stakingContract.nftsStaked(BIG_1);
            expect(nftsStakedToken1.originalOwner).to.be.equal(
                "0x0000000000000000000000000000000000000000"
            );
            expect(nftsStakedToken1.stakeTime).to.be.undefined;
        });
        it("should revert since the caller is not the original owner", async () => {
            await expect(
                stakingContract.connect(account1).withdrawNFT(BIG_1)
            ).to.be.revertedWith("Not original owner!");
        });
    });
    describe("withdrawStakingReward", () => {
        beforeEach(async () => {
            const provider = await ethers.provider;
            // before each withdraw it mints a token sends it to the stakingContract + adds a day to the evm
            const tx = await nftContract.mint(deployer.address, {
                value: PRICE,
            });
            await tx.wait();
            await nftContract.approve(stakingContract.address, BIG_1);
            const sendTx = await stakingContract.depositNFT(BIG_1);
            await sendTx.wait();

            await provider.send("evm_increaseTime", [24 * 60 * 60]);
        });
        it("should withdraw the staking rewards for one whole day", async () => {
            let userBalance = await tokenContract.balanceOf(deployer.address);
            expect(userBalance).eq(
                BigNumber.from(ethers.utils.parseEther("0"))
            );
            const withdrawTx = await stakingContract.withdrawStakingReward(
                BIG_1
            );
            await withdrawTx.wait();
            userBalance = await tokenContract.balanceOf(deployer.address);
            expect(userBalance).eq(
                BigNumber.from(ethers.utils.parseEther("10"))
            );
            expect(await nftContract.balanceOf(deployer.address)).eq(BIG_0);
        });
        it("should withdraw the staking rewards for two whole days", async () => {
            // adds another day
            await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
            const withdrawTx = await stakingContract.withdrawStakingReward(
                BIG_1
            );
            await withdrawTx.wait();
            const userBalance = await tokenContract.balanceOf(deployer.address);
            expect(userBalance).eq(
                BigNumber.from(ethers.utils.parseEther("20"))
            );
            expect(await nftContract.balanceOf(deployer.address)).eq(BIG_0);
        });
        it("should revert since the caller of withdrawStakingReward is not the original owner", async () => {
            await expect(
                stakingContract.connect(account1).withdrawStakingReward(BIG_1)
            ).to.be.revertedWith("Not original owner!");
        });
    });
    describe("withdrawStakingRewardAndNFT", () => {
        beforeEach(async () => {
            const provider = await ethers.provider;
            // before each withdraw it mints a token sends it to the stakingContract + adds a day to the evm
            const tx = await nftContract.mint(deployer.address, {
                value: PRICE,
            });
            await tx.wait();
            await nftContract.approve(stakingContract.address, BIG_1);
            const sendTx = await stakingContract.depositNFT(BIG_1);
            await sendTx.wait();
            await provider.send("evm_increaseTime", [24 * 60 * 60]);
        });
        it("should withdraw the staking rewards and the nft after one whole day of staking", async () => {
            const withdrawTx =
                await stakingContract.withdrawStakingRewardAndNFT(BIG_1);
            await withdrawTx.wait();
            const userBalance = await tokenContract.balanceOf(deployer.address);
            const nftsStakedToken1 = await stakingContract.nftsStaked(BIG_1);

            expect(userBalance).eq(
                BigNumber.from(ethers.utils.parseEther("10"))
            );
            expect(nftsStakedToken1.originalOwner).to.be.equal(
                "0x0000000000000000000000000000000000000000"
            );
            expect(nftsStakedToken1.stakeTime).to.be.undefined;
            expect(await nftContract.balanceOf(deployer.address)).eq(BIG_1);
        });
        it("should withdraw the staking rewards and the nft after two whole day of staking", async () => {
            // adds another day
            await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
            const withdrawTx =
                await stakingContract.withdrawStakingRewardAndNFT(BIG_1);
            await withdrawTx.wait();
            const userBalance = await tokenContract.balanceOf(deployer.address);
            const nftsStakedToken1 = await stakingContract.nftsStaked(BIG_1);
            expect(userBalance).eq(
                BigNumber.from(ethers.utils.parseEther("20"))
            );
            expect(nftsStakedToken1.originalOwner).to.be.equal(
                "0x0000000000000000000000000000000000000000"
            );
            expect(nftsStakedToken1.stakeTime).to.be.undefined;
            expect(await nftContract.balanceOf(deployer.address)).eq(BIG_1);
        });
        it("should revert since the caller of withdrawStakingReward is not the original owner", async () => {
            await expect(
                stakingContract
                    .connect(account1)
                    .withdrawStakingRewardAndNFT(BIG_1)
            ).to.be.revertedWith("Not original owner!");
        });
    });
    describe("calculateStakingReward", () => {
        beforeEach(async () => {
            const provider = await ethers.provider;
            // before each withdraw it mints a token sends it to the stakingContract + adds a day to the evm
            const tx = await nftContract.mint(deployer.address, {
                value: PRICE,
            });
            await tx.wait();
            await nftContract.approve(stakingContract.address, BIG_1);
            const sendTx = await stakingContract.depositNFT(BIG_1);
            await sendTx.wait();
            await provider.send("evm_increaseTime", [24 * 60 * 60]);
            await provider.send("evm_mine");
        });
        it("should return the staking rewards for one whole day", async () => {
            const stakingAmount = await stakingContract.calculateStakingReward(
                BIG_1
            );

            expect(stakingAmount).eq(
                BigNumber.from(ethers.utils.parseEther("10"))
            );
        });
        it("should return the staking rewards for nine whole days", async () => {
            // adds another day
            await ethers.provider.send("evm_increaseTime", [8 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");
            const stakingAmount = await stakingContract.calculateStakingReward(
                BIG_1
            );

            expect(stakingAmount).eq(
                BigNumber.from(ethers.utils.parseEther("90"))
            );
        });
    });
});
