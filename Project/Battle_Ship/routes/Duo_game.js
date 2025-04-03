var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Duo_game', { title: 'Морской бой' });
});

module.exports = router;
