var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt') 
const connection_db =require('../data_base')

//Главный сайт
router.get('/', function(req, res, next) {
    if(req.session.USER){
        id = req.session.USER.Id
        connection_db.updatasession(id,(err,result)=>{
            if(err){
                console.log(err)
            }else if(result.length > 0) {
                // Проверяем переданный пароль с хэшем
                req.session.USER.Win = result[0].Win
                req.session.USER.Loss = result[0].Loss
                console.log("Данные пользователя:", req.session.USER)
                res.render('Battal_Ship',{
                    session: req.session
                })
            }
        })
    }else{
        res.render('Battal_Ship',{
            session: req.session
        });
    }
});

//Режимы игры
router.get('/Solo_game', function(req, res, next) {
    res.render('Solo_game');
});
router.get('/Duo_game', function(req, res, next) {
    res.render('Duo_game');
});
router.get('/Net_game', function(req, res, next) {
    res.render('Net_game');
});

//Вход(get)
router.get('/Login', function(req, res, next) {
    res.render('Login');
});
//Регистрация(get)
router.get('/Register', function(req, res, next) {
    res.render('Register');
});
//Регистрация(post)
router.post('/Register', (req, res) => {
    const { nick,login, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    // Проверяем, что username, password и email не пустые
    if (!nick || !password || !login) {
        return res.redirect('/Register')
    };
    console.log(login)
    /*
    if(password.length < 8){
        return res.render('layout', { error: 'Хотябы 8 циферок напиши', body: 'register' });
    };
    */
    connection_db.findUserByUsername(login, (err, results) => {
        if(Object.keys(results).length > 0){
            console.error(err);
            return res.redirect('/Register')
        }
        else{
            connection_db.createUser(nick,login, hashedPassword, (err, results) => {
            if (err) {
                console.error(err);
                return res.redirect('/Register')
            }
            res.redirect('/');
            console.log("Пользователь зарегистрерировался.")
            }); 
        }
    })
});

//Войти в аккаунт(post)
router.post('/Login', (req, res) => {
    const {login, password} = req.body;
    
    // Проверяем, что username, password и email не пустые
    if (!password || !login) {
        console.log("Заполните поля")
        return res.redirect('/Login')
    };
    connection_db.findUserByUsername(login, (err, results) => {
        if (err) {
            console.log("Пользователь не найден.")
            console.log(err);
            return res.redirect('/Login')
        }

        // Проверяем наличие пользователя с таким именем
        if (results.length > 0) {
            const user = results[0];
            // Проверяем переданный пароль с хэшем
            const isMatch = bcrypt.compareSync(password, user.Password); // здесь происходит сравнение
            if (isMatch) {//Удача
                req.session.USER = {
                    Id: user.id,
                    Nick: user.Nick,
                    Win: user.Win,
                    Loss: user.Loss
                };
                console.log(req.session.USER)
                return res.redirect('/')
            } else {//Неудача
                console.log("Всё не окей")
                console.log(err)
                return res.redirect('/Login')
            }
        } else {
            console.log("Не знаем таких")
            console.log(err)
            return res.redirect('/Login')
            
        }
    });
    
});

//Взять данные с сессии и передать клиенту
router.get('/take_data', (req,res)=>{
    if (!req.session.USER) {
        return res.status(401).json({ error: "Не авторизован" });
    }
    res.json({
        Data_session:req.session.USER
    })
})
//Выйти с аккаунта(post)
router.post('/go_out',(req,res)=>{
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/'); // Ошибка при выходе
        }
        res.redirect('/'); // Успешный выход
    });
})


module.exports = router;