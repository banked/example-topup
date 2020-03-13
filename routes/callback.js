var express = require('express')
var successRouter = express.Router()
var errorRouter = express.Router()

successRouter.get('/', function (req, res, next) {
  res.redirect('/account?topup=success')
})

errorRouter.get('/', function (req, res, next) {
  res.redirect('/account?topup=error')
})

module.exports = {
  success: successRouter,
  error: errorRouter
}
