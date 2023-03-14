const { ethers } = require("hardhat")
const {expect, assert} = require("chai")

async function deploy() {
    const contractFactory = await ethers.getContractFactory("SimpleStorage")
}
describe("SimpleStorage", function () {
    let contractFactory, simpleStorage

    beforeEach(async function() {
        contractFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await contractFactory.deploy()
    })

    it("Should start with favNo == 0", async function() {
        const curFavNumber = await simpleStorage.retrieve()

        const expectedVal = "0";

        assert.equal(curFavNumber.toString(), expectedVal)
    })

    it("Should update when 'store' is called", async function() {
        const test = "7"
        await simpleStorage.store(test)

        const updatedVal = await simpleStorage.retrieve()

        assert.notEqual(test.toString(), updatedVal.toString)

    })
})
