var express = require('express')
var router = express.Router()
var Users = require('../db/users')

/* GET home page. */
router.get('/', async function (req, res, next) {
  if (req.cookies.topupSessionCookie) {
    await Users.deleteBySessionID(req.cookies.topupSessionCookie)
  }
  res.redirect('/')
})

module.exports = router
