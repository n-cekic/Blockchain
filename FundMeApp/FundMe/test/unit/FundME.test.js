const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const {
    sortAndDeduplicateDiagnostics,
    isConstructSignatureDeclaration,
    EndOfLineState,
} = require("typescript")

const { developmentChains } = require("../../helper_hardhat_config")
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
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
                  const startingContractBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endContractBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  assert.equal(endContractBalance, 0)
                  assert.equal(
                      startingContractBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endDeployerBalance.add(gasCost).toString()
                  )
              })
              it("withdraw ETH after multiple funders", async function () {
                  const accounts = await ethers.getSigners()
                  for (i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  // Let's comapre gas costs :)
                  // const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait()
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const withdrawGasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  // Assert
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(withdrawGasCost).toString()
                  )
                  // Make a getter for storage variables
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("only allows owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const fundMeConnectedContract = await fundMe.connect(attacker)
                  await expect(
                      fundMeConnectedContract.withdraw()
                  ).to.be.revertedWithCustomError(
                      fundMeConnectedContract,
                      "FundMe__NotOwner"
                  )
              })
          })
      })
