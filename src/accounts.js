const web3 = require('web3')
const fs = require('fs');

const SECRET_PATH = '.secret'
const web3Instance = new web3()

function getAccount() {
  console.log('Getting your account')
  if (!fs.existsSync(SECRET_PATH)) {
    console.log('No account found, create one first')
    return false
  }

  const privateKey = fs.readFileSync(SECRET_PATH, 'utf8');
  const account = web3Instance.eth.accounts.privateKeyToAccount(privateKey);
  console.log(`Found account ${account.address}`)
  return account
}

function createAccount() {
  console.log('Creating a new account')
  const account = web3Instance.eth.accounts.create();
  console.log(`Made new account ${account.address}`)
  fs.writeFileSync(SECRET_PATH, account.privateKey)
  console.log(`Account private key saved to ${SECRET_PATH}`)
}

module.exports = {
  getAccount,
  createAccount
}