const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    pingTimeout: 30000, // 30 секунд для таймаута
    pingInterval: 5000  // проверка каждые 5 секунд
});
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
let room_using = []//Для быстрого поиска
let room_using_person=[]//Для персональных.

io.on('connection', (socket) => {
    user = socket.id
    console.log('Коннект пользователя', user);

    key_click++
    client++

    socket.join(Math.round(client/2))
    socket.emit('serverMsg', Math.round(client/2))

    socket.emit('connection_status', { status: 'connected' });
    
    // Таймер для отключения
    let disconnectTimer;
    
    const startDisconnectTimer = () => {
        disconnectTimer = setTimeout(() => {
            console.log('Пользователь отключился по таймауту');
            socket.disconnect(true);
        }, 30000); // 30 секунд
    };
    
    // Остановка таймера при активности
    const resetDisconnectTimer = () => {
        if (disconnectTimer) {
            clearTimeout(disconnectTimer);
            startDisconnectTimer();
        }
    };
    
    // События, которые сбрасывают таймер
    socket.on('activity', resetDisconnectTimer);
    socket.on('reconnect_attempt', () => {
        console.log('Попытка переподключения');
        socket.emit('connection_status', { status: 'reconnecting' });
    });
    
    // Начало таймера
    startDisconnectTimer();
    
    socket.on('disconnect', (reason) => {
        console.log(`Пользователь отключился. Причина: ${reason}`);
        if (disconnectTimer) clearTimeout(disconnectTimer);
    });


    
    if(key_click==1){
        console.log("Ждём второго игрока.")
    }else{
        key_click=0
        io.to(rooms).emit('CanClick')
        //socket.emit('CanClick', true)
    }

    socket.on('initing', clientRoom=>{//Объявляем комнату.
        rooms = clientRoom
    })

    // Можно добавить дополнительные обработчики событий здесь
    socket.on('ButtonClick',clientRoom=>{
        io.to(clientRoom).emit('EventServer')//Отобразить у всех действие.
    })

    socket.on('disconnect', () => {
        console.log('Пользователь отключился', user);
    });
});

// Запуск сервера
const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});