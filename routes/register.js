var express = require('express');
var router = express.Router();
var Users = require('../db/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', {
    flash: ''
  });
});

router.post('/', async function(req, res, next) {
  let errors = [];
  if (!req.body.name) errors.push('name');
  if (!req.body.email) errors.push('email');
  if (!req.body.password) errors.push('password');
  if (errors.length) {
    res.render('register', {
      flash: `You need to tell us your ${errors.join(', ')} when you reigster`
    });
  } else {
    const user = await Users.create(req.body);
    res.cookie('topupSessionCookie', user.sessionID);
    res.redirect('/account');
  }
});


module.exports = router;
