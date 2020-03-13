var express = require('express');
var router = express.Router();
var Topups = require('../db/topups');

router.post('/', async function(req, res, next) {
  const topupID = parseInt(req.body.reference.split(' ')[1], 10);
  if (req.body.state === 'sent') {
    await Topups.updateStateByID(topupID, 'complete');
  }
  res.sendStatus(200);
});

module.exports = router;
