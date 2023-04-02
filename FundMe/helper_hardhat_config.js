const networkConfig = {
    4: {
        name: "rinkeby",
        ethUSDPriceFeed: "x0123",
    },
    137: {
        name: "polygon",
        ethUSDPriceFeed: "x0123",
    },
    5: {
        name: "goerli",
        ethUSDPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    31337: {
        name: "localhost",
    },
}

const developmentChains = ["hardhat", "localhost"]

const DECIMALS = 8
const INITIAL_ANSWER = 200000000000

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}
