var express = require('express')
var router = express.Router()
var Users = require('../db/users')
var Topups = require('../db/topups')

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    if (req.cookies.topupSessionCookie) {
      const user = await Users.findBySessionID(req.cookies.topupSessionCookie)
      await Topups.deleteByUserID(user.id)
      await Users.deleteBySessionID(req.cookies.topupSessionCookie)
    }
    res.redirect('/')
  } catch (e) {
    res.sendStatus(500)
  }
})

module.exports = router
