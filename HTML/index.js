import {ethers} from "./ethers-5.6.esm.min.js"
import {abi, contractAddress} from "./constants.js"

const buttonConnect = document.getElementById("connectWallet")
const buttonFund = document.getElementById("fund")
const buttonGetBalance = document.getElementById("getBalance")
const buttonWithdraw = document.getElementById("withdraw")

buttonConnect.onclick = connectWallet
buttonFund.onclick = fund
buttonGetBalance.onclick = getBalance
buttonWithdraw.onclick = withdraw

//console.log(ethers)

function connectWallet() {
    buttonConnect.disabled = true
    buttonConnect.textContent = "Connecting..."

    connect().then(() => {
        buttonConnect.disabled = false
        buttonConnect.textContent = "Connected"
    }).catch((e) => {
        console.log(e)
        buttonConnect.textContent = "Failed to connect - retry"
        buttonConnect.disabled = false
    })
}

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Wallet detected")
        await window.ethereum.request({method: "eth_requestAccounts"})
    } else {
        console.log("No wallet detected.")
        // TODO: display an error in UI
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(`Curent balance: ${ethers.utils.formatEther(balance)}`)
    }
}

async function withdraw() {
    if (typeof window.ethereum === "undefined")
        return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
        console.log("Withdrawing...")
        const transactionResponse = await contract.cheaperWithdraw()
        await listenForTransactionMined(transactionResponse, provider)
    } catch (error) {
        console.log(error)
    }
}

async function fund(ethAmount) {
    //do funding
    const labelETHAmount = document.getElementById("ethAmount")

    ethAmount = labelETHAmount.value
    console.log(`Funding with ${ethAmount}`)
    if (typeof window.ethereum !==  "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
            const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
            await listenForTransactionMined(transactionResponse, provider)
            console.log("Done!")
        } catch (e) {
            console.log("ERROR!")
        }
    }
}

function listenForTransactionMined(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReciept) => {
            console.log(`Completed with ${transactionReciept.confirmations} confirmations.`)
            resolve()
        })
    })
}