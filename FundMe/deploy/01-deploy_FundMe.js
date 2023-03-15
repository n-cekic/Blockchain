const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper_hardhat_config")



async function deploy(hre) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log} = deployments
    const { deployer } = await getNamedAccounts()
    const chainID = network.config.chainId
    const chainName = network.name

    let ethToUSDAddress
    if (developmentChains.includes(chainName)) {
        const ethToUSDAdggregator = await deployments.get("MockV3Aggregator")
        ethToUSDAddress = ethToUSDAdggregator.address
    } else
        ethToUSDAddress = networkConfig[chainID]["ethUSDPriceFeed"]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        log: true,
        args: [ethToUSDAddress]
    })

    console.log("----------------------------------------")
}

module.exports.default = deploy
module.exports.tags = ["all", "fundme"]