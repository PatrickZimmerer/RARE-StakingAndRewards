const { network, ethers, upgrades } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { log } = deployments;

    const name = "SimpleToken";
    const symbol = "STK";

    let addressMap = require("../shared-data.js");
    const stakingContractAddress = addressMap.stakingContractAddress;

    const arguments = [name, symbol, stakingContractAddress];

    const Token = await ethers.getContractFactory("Token");
    const token = await upgrades.deployProxy(Token, arguments, {
        initializer: "initialize",
    });

    // only verify the code when not on development chains as hardhat
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying UPGRADEABLE Token contract...");
        await verify(token.address, arguments);
    }
    log("UPGRADEABLE Token deployed successfully at:", token.address);
    log("-----------------------------------------");

    addressMap.tokenContractAddress = token.address;

    log("All contracts deployed successfully ");
    log("-----------------------------------------");
    console.log("contract addresses are", addressMap);
};

module.exports.tags = ["all", "token"];
