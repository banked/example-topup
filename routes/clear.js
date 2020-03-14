var express = require('express')
var router = express.Router()
var Users = require('../db/users')
var Topups = require('../db/topups')

router.get('/', async function (req, res, next) {
  const token = req.query.token
  if (!token) {
    res.sendStatus(400)
  }
  if (token !== process.env.CLEAR_TOKEN) {
    res.sendStatus(403)
  }
  try {
    await Topups.clear()
    await Users.clear()
    res.sendStatus(200)
  } catch(e) {
    res.sendStatus(500)
  }
})

module.exports = router
