const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');


var UserRouter = require('./routes/user');



// Настройка EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'static')));


// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.render('index');
});

app.use('/user', UserRouter);

let client = 0
let key_click = 0

let rooms//Комната

// Обработка подключений Socket.IO
//[[Название комнаты, id-user1, id-user2]]
let room_using = []//Уже созданные комнаты.
let room_using_person=[]//Для персональных.

io.on('connection', (socket) => {
    user = socket.id
    console.log('Коннект пользователя', user);

    key_click++
    client++


    rooms=Math.round(client/2)
    console.log(rooms)
    socket.join(Math.round(client/2))
    socket.emit('serverMsg', Math.round(client/2))
    
    

    if(key_click==1){
        console.log("Ждём второго игрока.")
        room_using.push([rooms])
        console.log(JSON.stringify(room_using))
        
    }else{
        key_click=0
        io.to(rooms).emit('CanClick')
        //socket.emit('CanClick', true)
    }

    // Можно добавить дополнительные обработчики событий здесь
    socket.on('ButtonClick',clientRoom=>{
        io.to(clientRoom).emit('EventServer')//Отобразить у всех действие.
    })
    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

// Запуск сервера
const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});