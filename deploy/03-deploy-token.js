const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const name = "ERC777BondingCoin";
    const symbol = "ECC";

    let obj = require("../shared-data.js");
    const stakingContractAddress = obj.stakingContractAddress;
    console.log("stakingContract address is", stakingContractAddress);

    const arguments = [name, symbol, stakingContractAddress];

    const token = await deploy("Token", {
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
        await verify(token.address, arguments);
    }
    log("Token deployed successfully at:", token.address);
    log("-----------------------------------------");
};

module.exports.tags = ["all", "token"];
