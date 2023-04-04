const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper_hardhat_config")
const { assert } = require("chai")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("0.01")

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.cheaperWithdraw()
              const endBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endBalance.toString(), "0")
          })
      })
