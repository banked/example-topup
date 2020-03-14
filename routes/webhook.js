var express = require('express')
var router = express.Router()
var Topups = require('../db/topups')
var banked = require('../lib/banked')

router.post('/', async function (req, res, next) {
  try {
    const topupID = parseInt(req.body.reference.split(' ')[1], 10)
    const verification = await banked.webhooks.validate({
      payload_header: req.headers['banked-signature'],
      payload: JSON.stringify(req.body),
      signature: process.env.SIGNATURE_KEY
    })
    if (req.body.state === 'sent' && verification.isValid) {
      await Topups.updateStateByID(topupID, 'complete')
    }
    res.sendStatus(200)
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
})

module.exports = router
