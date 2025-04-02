var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('test_game', { title: 'Морской бой',
        bord: 'qwer'
    });
});
module.exports = router;