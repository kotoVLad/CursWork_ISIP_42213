var express = require('express');
var router = express.Router();
const creat_f = require('./javascripts/creat_field')

console.log(creat_f)


router.get('/', function(req, res, next) {
    res.render('test_game', { title: 'Морской бой',
        bord: 'qwer'
    });
});
module.exports = router;