const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { sortAndDeduplicateDiagnostics } = require("typescript")

describe("FundMe", function () {
    let fundMe, deployer, mockV3Aggregator
    const sendValue = "100000000000000000" //ethers.utils.parseEther("1")

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
    })
})
