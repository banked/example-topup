var Users = require('../db/users')

module.exports = async (req, res, next) => {
  try {
    req.user = await Users.findBySessionID(req.cookies.topupSessionCookie)
    next()
  } catch (e) {
    console.log(e)
    res.redirect('/register')
  }
}
