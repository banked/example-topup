var express = require('express')
var router = express.Router()
var Topups = require('../db/topups')
var uuid = require('uuid').v4

const render = (res, user, topups, flash, didBatchSucceed) => {
  res.render('admin', {
    user,
    topups: topups.filter((topup) => topup.state !== 'batched'),
    flash,
    total: topups.reduce((a, b) => {
      return a + b.amount
    }, 0),
    batched: topups.filter((topup) => topup.state === 'batched'),
    batchSuccess: didBatchSucceed
  })
}

router.get('/', async function (req, res, next) {
  try {
    const topups = await Topups.findByUserID(req.user.id)
    const flash = (req.query.batch === 'error') ? 'Something we wrong with processing the batch payment' : ''
    render(res, req.user, topups, flash, (req.query.batch === 'success'))
  } catch (e) {
    console.error(e)
    res.sendStats(500)
  }
})

router.post('/', async function (req, res, next) {
  try {
    await Promise.all(Array.from(Array(parseInt(req.body.amount, 10)).keys()).map(() => {
      return {
        amount: (Math.floor(Math.random() * (100 - 1 + 1)) + 1) * 100,
        userID: req.user.id,
        currency: 'GBP'
      }
    }).map((topup) => {
      return Topups.createAdmin(topup)
    }))
    const topups = await Topups.findByUserID(req.user.id)
    render(res, req.user, topups, '')
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.post('/batch', async function (req, res, next) {
  try {
    const topups = await Topups.findByUserID(req.user.id)
    if (!req.body.selected || req.body.selected.length <= 0) {
      render(res, req.user, topups, 'You need to select at least one payment to pay in batch')
    } else {
      try {
        const payees = await Promise.all(req.body.selected.map(async (paymentID) => {
          const payment = await Topups.findByID(paymentID)
          await Topups.updateStateByID(parseInt(paymentID, 10), 'batched')
          return {
            name: `Payee ${paymentID}`,
            account_number: '00000000',
            sort_code: '000000',
            reference: 'Batch Test',
            amount: payment[0].amount,
            client_id: uuid()
          }
        }))
        const batchTopup = await Topups.createBatch({
          success_url: `${process.env.BASE_URL}/admin?batch=success`,
          error_url: `${process.env.BASE_URL}/admin?batch=error`,
          provider_id: process.env.PROVIDER_ID,
          currency: 'GBP',
          payees
        })
        console.info('Auth URL:', batchTopup.data.url)
        res.redirect(batchTopup.data.url)
      } catch (e) {
        console.error(e)
        render(res, req.user, topups, 'Something went wrong creating the batch payment')
      }
    }
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

module.exports = router
