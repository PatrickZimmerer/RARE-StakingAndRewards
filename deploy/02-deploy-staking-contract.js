const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    let addressMap = require("../shared-data.js");
    const nftContractAddress = addressMap.nftContractAddress;

    const arguments = ["0xe4064d8E292DCD971514972415664765e51B5364"];

    const stakingContract = await deploy("StakingContract", {
        from: deployer,
        args: arguments,
        logs: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    // only verify the code when not on development chains as hardhat
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...");
        await verify(stakingContract.address, arguments);
    }
    log("StakingContract deployed successfully at:", stakingContract.address);
    log("-----------------------------------------");

    addressMap.stakingContractAddress = stakingContract.address;
};

module.exports.tags = ["all", "StakingContract"];
