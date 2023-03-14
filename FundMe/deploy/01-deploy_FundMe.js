const { network } = require("hardhat")


async function deploy(hre) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log} = deployments
    const accounts = await getNamedAccounts()
    const chainID = network.config.chainId
}

module.exports.default = deploy