const { ethers, run, network } = require("hardhat")

async function main() {
	const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")

	console.log("Deploying contract...")
	const simpleStorage = await simpleStorageFactory.deploy()
	await simpleStorage.deployed()
	console.log(`Deployed contract to ${simpleStorage.address}`)

	const GOERLI_CHAIN_ID = 5
	if (network.config.chainId === GOERLI_CHAIN_ID && process.env.ETHERSCAN_API_KEY ) {
		const noOfBlocksToBeMined = 6;
		console.log(`Waiting for ${noOfBlocksToBeMined} blocks to be mined...` )
		await simpleStorage.deployTransaction.wait(noOfBlocksToBeMined)
		await verify(simpleStorage.address, [])
	}

	const curFavNumber = await simpleStorage.retrieve()
	console.log(`Curent value is ${curFavNumber}.`)

	const transactionResp = await simpleStorage.store(7)
	await transactionResp.wait(1)

	const updatedFavNumber = await simpleStorage.retrieve()
	console.log(`Updated value is ${updatedFavNumber}`)

}

async function verify(contractAddress, args) {
	console.log("Verifiyng contract...")
	
	try {
		await run("verify:verify", {
			address: contractAddress,
			constructorArguments: args,
		})
	} catch (error) {
		if (error.message.toLowerCase().includes("already veified"))
			console.log("Already verified.")
		else
			console.log(error)
	}
}

main().then( () => process.exit(0))
	.catch( (error) => {
		console.error(error)
		process.exit(1)
	})
