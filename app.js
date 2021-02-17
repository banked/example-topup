var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
var authenticate = require('./lib/authenticate')

var indexRouter = require('./routes/index')
var registerRouter = require('./routes/register')
var accountRouter = require('./routes/account')
var logoutRouter = require('./routes/logout')
var callbackRouter = require('./routes/callback')
var webhookRouter = require('./routes/webhook')
var clearRouter = require('./routes/clear')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/register', registerRouter)
app.use('/account', authenticate, accountRouter)
app.use('/logout', logoutRouter)
app.use('/success', callbackRouter.success)
app.use('/error', callbackRouter.error)
app.use('/webhook', webhookRouter)
app.use('/clear', clearRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
