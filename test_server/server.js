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
//[[Название комнаты, user1={Ник,id-user1},user2={Ник,id-user2}] //Комната[n][0], status[n][1]...
let room_using = []//Уже созданные комнаты.  Комната 1 = 0 в массиве и тд.
let room_using_person=[]//Для персональных.

io.on('connection', (socket) => {
    console.log('Коннект пользователя');

    socket.on('cre_con_room', (data)=>{
        console.log("-----------------------------")
        user = socket.id
        console.log('Id-пользователя:',user);
        Nick=data.Nick
        ID_user=data.ID_user
        key_click++
        client++
        rooms=Math.round(client/2)

        if(key_click==1){

            socket.join(rooms)

            console.log("Создана комната:",rooms)
            console.log("Ждём второго игрока.")

            room_using.push([rooms,{Nick:Nick,ID_user:ID_user}])
            
            console.log(JSON.stringify(room_using))
            console.log("-----------------------------")

            socket.emit('serverMsg', Math.round(client/2))
            
            
        }else{
            socket.join(rooms)
            key_click=0
            a = rooms-1
            console.log("Второй игрок зашёл в комнту:",rooms)
            for(i=0;i<room_using.length;i++){
                if(room_using[i][0]==rooms){
                    room_using[i].push({Nick:Nick,ID_user:ID_user})
                    break
                }
            }
            console.log(JSON.stringify(room_using))
            console.log("-----------------------------")

            socket.emit('serverMsg', rooms)
            io.to(rooms).emit('CanClick')
            //socket.emit('CanClick', true)
        }
    })

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