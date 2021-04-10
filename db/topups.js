var banked = require('../lib/banked')

var topups = []

const hydrateRequest = (body) => {
  return {
    reference: `Topupify ${body.id}`,
    success_url: `${process.env.BASE_URL}/success`,
    error_url: `${process.env.BASE_URL}/error`,
    line_items: [{
      name: 'Topping up your Topupify account',
      amount: body.amount,
      currency: body.currency,
      quantity: 1
    }],
    payee: {
      name: process.env.PAYEE_NAME,
      account_number: process.env.ACCOUNT_NUMBER,
      sort_code: process.env.SORT_CODE
    },
    payer: body.payer
  }
}

exports.create = async (topup) => {
  return new Promise(async (resolve, reject) => {
    try {
      topup.id = topups.length + 1
      topup.__bankedResponse = await banked.payments.create(hydrateRequest(topup))
      topup.state = 'pending'
      topup.created_at = new Date().toString()
      topup.redirect_url = topup.__bankedResponse.data.url
      topup.showInAccount = true
      topup.countInTotal = true

      topups.push(topup)
      resolve(topup)
    } catch (e) {
      reject(e)
    }
  })
}


exports.findByUserID = (userID) => {
  const result = topups.filter((topup) => {
    return topup.userID === userID
  })
  return Promise.resolve(result || [])
}

exports.updateStateByID = (topupID, state) => {
  const topup = topups[topupID - 1]
  if (topup) topup.state = state
  return Promise.resolve(topup)
}

exports.updateCountInTotalByID = (topupID, countInTotal) => {
  const topup = topups[topupID - 1]
  if (topup) topup.countInTotal = countInTotal
  return Promise.resolve(topup)
}

exports.clear = () => {
  topups = []
  return Promise.resolve()
}

exports.deleteByUserID = (userID) => {
  topups = topups.filter((topup) => topup.userID !== userID)
  return Promise.resolve()
}

exports.createBatch = (batch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const br = await banked.payments.batch.create(batch)
      resolve(br)
    } catch (e) {
      reject(e)
    }
  })
}

exports.findByID = (id) => {
  const result = topups.filter((topup) => {
    return topup.id === parseInt(id, 10)
  })
  return Promise.resolve(result)
}
