const contractkit = require('@celo/contractkit')
const accounts = require('./accounts')

const NODE_URL = 'https://alfajores-forno.celo-testnet.org'

async function getBalances() {
  console.log('Getting your balances')
  const kit = contractkit.newKit(NODE_URL)
  const address = accounts.getAccount().address
  const balances = await kit.getTotalBalance(address)
  console.log(`Dollar balance: ${balances.usd}`)
  console.log(`Gold balance: ${balances.gold}`)
  kit.stop()
}

async function sendPayment(params) {
  const recipient = params.to
  const amount = params.amount
  const token = params.token
  console.log(`Sending payment of ${amount} ${token} to ${recipient}`)

  const kit = contractkit.newKit(NODE_URL)
  
  // Set up your account in contract kit
  const account = accounts.getAccount()
  kit.addAccount(account.privateKey)
  kit.defaultAccount = account.address
  console.log('Kit account is set up')

  // Get the right token contract
  let contract
  if (token.toLowerCase() === 'cusd') {
    contract = await kit.contracts.getStableToken()
  }
  else if (token.toLowerCase() === 'cgld') {
    contract = await kit.contracts.getGoldToken()
  }
  else {
    console.error(`Invalid token ${token}, use cGLD or cUSD`)
    return false
  }
  console.log('Kit contract is set up, creating transaction')

  // Create the payment transaction
  try {
    const tx = await contract.transfer(recipient, amount).send()
    const receipt = await tx.waitReceipt()
    console.log('Tx receipt recieved', receipt)
    const newBalance = await contract.balanceOf(account.address)
    console.log(`New balance is ${newBalance.toString()}`)
  } catch (error) {
    console.error('Error sending payment, please try again', error)
  }
  finally {
    kit.stop()
  }
}

module.exports = {
  getBalances,
  sendPayment
}