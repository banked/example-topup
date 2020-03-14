var Banked = require('@banked/node')

var banked = new Banked({
  api_key: process.env.BANKED_API_KEY,
  secret_key: process.env.BANKED_API_SECRET
})

module.exports = banked
