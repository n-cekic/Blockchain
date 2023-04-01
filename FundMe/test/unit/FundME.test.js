const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const {
    sortAndDeduplicateDiagnostics,
    isConstructSignatureDeclaration,
    EndOfLineState,
} = require("typescript")

describe("FundMe", function () {
    let fundMe, deployer, mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")

    this.beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.getPriceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async function () {
        it("tests for sufficient funds", async function () {
            await expect(fundMe.fund()).to.be.reverted
        })
        it("update the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const resp = await fundMe.getAddressToAmountFunded(deployer)
            assert.equal(resp.toString(), sendValue.toString())
        })
        it("adds new funder", async function () {
            await fundMe.fund({ value: sendValue })
            const resp = await fundMe.getFunder(0)
            assert.equal(resp, deployer)
        })
    })
    describe("withdraw", async function () {
        this.beforeEach(async function () {
            await fundMe.fund({ value: sendValue })
        })

        it("withdraw ETH from a single funder", async function () {
            const startingContractBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            
            const {gasUsed, effectiveGasPrice} = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endContractBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            assert.equal(endContractBalance, 0)
            assert.equal(
                startingContractBalance.add(startingDeployerBalance).toString(),
                endDeployerBalance.add(gasCost).toString()
            )
        })
    })
})
