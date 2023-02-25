const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const arguments = ["0xe4064d8E292DCD971514972415664765e51B5364"];

    const mintAndStake = await deploy("MintAndStake", {
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
        await verify(mintAndStake.address, arguments);
    }
    log("mintAndStakedeployed successfully at:", mintAndStake.address);
    log("-----------------------------------------");
    // updates stakingContractAddress so the ERC20 Token can add the address to the constructor when deploying the erc-20
    let obj = require("../shared-data.js");
    obj.stakingContractAddress = mintAndStake.address;
};

module.exports.tags = ["all", "mintAndStake"];
