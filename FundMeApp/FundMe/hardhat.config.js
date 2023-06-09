require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter")
require("dotenv").config()

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [{ version: "0.8.18" }, { version: "0.6.6" }],
    },
    networks: {
		hardhat: {
            chainId: 31337,
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
			blockConfirmations:6,
        },
    },
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
	},
    gasReporter: {
        enabled: true,
        outputFile: "gas_reporter.txt",
        token: "MATIC",
        noColors: true,
        currency: "USD",
        
    },
	namedAccounts: {
		deployer: {
			default: 0,
		},
	},
}
