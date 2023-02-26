const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const name = "SimpleNFT";
    const symbol = "SNT";

    const arguments = [name, symbol];

    const nft = await deploy("NFT", {
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
        await verify(nft.address, arguments);
    }
    log("nft deployed successfully at:", nft.address);
    log("-----------------------------------------");

    let addressMap = require("../shared-data.js");
    addressMap.nftContractAddress = nft.address;
};

module.exports.tags = ["all", "nft"];
