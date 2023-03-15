const { network } = require("hardhat")
const { developmentChains, DECIMALS, INITIAL_ANSWER } = require("../helper_hardhat_config")

module.exports = async ({}) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log} = deployments
    const { deployer } = await getNamedAccounts()
    const chainID = network.config.chainId

    if (developmentChains.includes(network.name)) {
        console.log("Deploying to a local network...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })

        console.log("Mocks deployed!!!")
    }
    console.log("----------------------------------------")

}

module.exports.tags = ["all", "mocks"]