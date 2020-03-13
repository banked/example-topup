var Banked = require('@banked/node')

var banked = new Banked({
  api_key: process.env.BANKED_API_KEY,
  secret_key: process.env.BANKED_API_SECRET
})

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

      topups.push(topup)
      resolve(topup)
    } catch (e) {
      reject(e)
    }
  })
}

exports.findByUserID = (userID) => {
  return new Promise((resolve) => {
    const result = topups.filter((topup) => {
      return topup.userID === userID
    })
    resolve(result || [])
  })
}

exports.updateStateByID = (topupID, state) => {
  return new Promise((resolve) => {
    topups[topupID - 1].state = state
    resolve(topups[topupID - 1])
  })
}
