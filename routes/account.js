var express = require('express')
var router = express.Router()
var Topups = require('../db/topups')

router.get('/', async function (req, res, next) {
  try {
    const _topups = await Topups.findByUserID(req.user.id)
    const accountTopups = _topups.filter((topup) => topup.showInAccount)
    const successfulTopups = _topups.filter((topup) => topup.countInTotal)
    res.render('account', {
      topups: accountTopups,
      total: successfulTopups.reduce((a, b) => {
        return a + b.amount
      }, 0),
      user: req.user,
      topupState: req.query.topup || ''
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})


router.get('/top-up', async function (req, res, next) {
  try {
    res.render('topup', {
      user: req.user,
      flash: '',
      clientKey: process.env.BANKED_CLIENT_KEY,
      paymentID: null
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.post('/top-up', async function (req, res, next) {
  if (!req.body.amount || req.body.amount <= 0) {
    res.render('topup', {
      user: req.user,
      flash: 'You need to indicate a amount of money to top up greater than zero',
      clientKey: process.env.BANKED_CLIENT_KEY
    })
  } else {
    try {
      const topup = await Topups.create({
        amount: req.body.amount * 100,
        userID: req.user.id,
        currency: 'GBP',
        payer: {
          name: req.user.name,
          email: req.user.email
        }
      })
      res.render('topup', {
        user: req.user,
        flash: '',
        clientKey: process.env.BANKED_CLIENT_KEY,
        paymentID: topup.__bankedResponse.data.id
      })
    } catch (e) {
      console.error(e)
      res.redirect('/account?topup=error')
    }
  }
})

module.exports = router
