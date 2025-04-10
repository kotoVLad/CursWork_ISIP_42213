var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('Net_game');
});
  
module.exports = router;