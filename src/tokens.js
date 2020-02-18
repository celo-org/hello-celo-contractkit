

function getBalances() {
  console.log('Getting your balances')
}

function sendPayment(params) {
  const recipient = params.to
  const amount = params.amount
  const token = params.token

  console.log(`Sending payment of ${amount} ${token} to ${recipient}`)
}

module.exports = {
  getBalances,
  sendPayment
}