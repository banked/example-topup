var express = require('express')
var router = express.Router()
var Users = require('../db/users')
var Topups = require('../db/topups')

router.get('/', async function (req, res, next) {
  try {
    const user = await Users.findBySessionID(req.cookies.topupSessionCookie)
    const topups = await Topups.findByUserID(user.id)
    res.render('account', {
      topups,
      total: topups.reduce((a, b) => {
        return a + b.amount
      }, 0),
      user,
      topupState: req.query.topup || ''
    })
  } catch (e) {
    console.log(e)
    res.redirect('/register')
  }
})

router.get('/top-up', async function (req, res, next) {
  try {
    const user = await Users.findBySessionID(req.cookies.topupSessionCookie)
    res.render('topup', {
      user,
      flash: ''
    })
  } catch (e) {
    console.log(e)
    res.redirect('/register')
  }
})

router.post('/top-up', async function (req, res, next) {
  try {
    const user = await Users.findBySessionID(req.cookies.topupSessionCookie)
    if (!req.body.amount || req.body.amount <= 0) {
      res.render('topup', {
        user,
        flash: 'You need to indicate a amount of money to top up greater than zero'
      })
    } else {
      try {
        const topup = await Topups.create({
          amount: req.body.amount * 100,
          userID: user.id,
          currency: 'GBP',
          payer: {
            name: user.name,
            email: user.email
          }
        })
        res.redirect(topup.redirect_url)
      } catch (e) {
        console.log(e)
        res.redirect('/account?topup=error')
      }
    }
    res.render('topup', {
      user
    })
  } catch (e) {
    console.log(e)
    res.redirect('/register')
  }
})

module.exports = router
