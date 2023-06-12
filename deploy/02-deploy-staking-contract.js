const { network, ethers, upgrades } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { log } = deployments;

    let addressMap = require("../shared-data.js");
    const nftContractAddress = addressMap.nftContractAddress;

    const arguments = [nftContractAddress];

    const StakingContract = await ethers.getContractFactory("StakingContract");
    const stakingContract = await upgrades.deployProxy(
        StakingContract,
        arguments,
        {
            initializer: "initialize",
        }
    );

    // only verify the code when not on development chains as hardhat
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying UPGRADEABLE Staking contract...");
        await verify(stakingContract.address, arguments);
    }
    log(
        "UPGRADEABLE StakingContract deployed successfully at:",
        stakingContract.address
    );
    log("-----------------------------------------");

    addressMap.stakingContractAddress = stakingContract.address;
};

module.exports.tags = ["all", "StakingContract"];
