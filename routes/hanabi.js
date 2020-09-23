var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let displayName = 'anonymous';
  let thumbUrl = 'anonymous';
  if (req.user) {
    displayName = req.user.displayName;
    thumbUrl = req.user.photos[0].value;
  }
  res.render('hanabi', { title: 'みんなで花火', displayName: displayName, thumbUrl: thumbUrl, ipAddress: 'http://localhost:8000' });
});

module.exports = router;