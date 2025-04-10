const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');


var UserRouter = require('./routes/user');
const { emit } = require('process');
const { Console } = require('console');

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
let userSockets={}
io.on('connection', (socket) => {
    //Тут должны создаваться кастомные ID
    socket.on('Id_identified',(id)=>{
        console.log("-----------------------------")
        console.log('Коннект пользователя');
        user = socket.id
        console.log('Id-пользователя:',user);
        ID_user=id
        userSockets[ID_user] = socket
        console.log('Кастомный-Id:',ID_user);
        console.log("-----------------------------")
    })

    socket.on('cre_con_room', (data)=>{
        console.log("-----------------------------")
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
            
            
        }else{
            socket.join(rooms)
            key_click=0
            console.log("Второй игрок зашёл в комнту:",rooms)
            for(i=0;i<room_using.length;i++){
                if(room_using[i][0]==rooms){
                    room_using[i].push({Nick:Nick,ID_user:ID_user})

                    console.log("Отправка User")
                    use1 = room_using[i][1].ID_user//id 1 пользователя комнаты
                    socket = userSockets[use1];//Soket 1 пользователя комнаты
                    Room_us2 = room_using[i][2].Nick//Ник 2 пользователя комнаты
                    console.log(Room_us2)
                    socket.emit('Cann_us', Room_us2)
                    
                    use2 = room_using[i][2].ID_user//id 2 пользователя комнаты
                    socket = userSockets[use2];//Soket 2 пользователя комнаты
                    Room_us1 = room_using[i][1].Nick//Ник 1 пользователя комнаты
                    socket.emit('Cann_us', Room_us1)
                    
                    break
                }
            }
            console.log(JSON.stringify(room_using))
            console.log("-----------------------------")

            socket.emit('serverMsg', rooms)
            io.to(rooms).emit('CanClick')
            //socket.emit('CanClick', true)
        }
        socket.emit('serverMsg', Math.round(client/2))

        console.log("-----------------------------")
        Users = Object.keys(userSockets)
        console.log("Текущие пользователи:", Users);
        console.log("-----------------------------")
    })

    // Можно добавить дополнительные обработчики событий здесь
    socket.on('ButtonClick',clientRoom=>{
        io.to(clientRoom).emit('EventServer')//Отобразить у всех действие.
    })
    socket.on('disconnect', (Room_dis) => {
        console.log('Пользователь отключился');
    });

    socket.on('leave_room', (data)=>{
        if(socket.rooms.has(data.clientRoom)){
            if(!data.user_triger){
                key_click=0
                client--
                console.log(`1.Пользователь ${data.Nick} вышел из комнаты ${data.clientRoom}, комната была удалена.`)
                socket.leave(data.clientRoom);

            }if(data.user_triger==true){
                console.log(`2.Пользователь ${data.Nick} вышел из комнаты ${data.clientRoom}.`)
                socket.leave(data.clientRoom);
                io.to(data.clientRoom).emit('User2_discon',data.Nick)

            }if(data.user_triger=="end"){
                console.log(`3.Пользователь ${data.Nick} вышел из комнаты ${data.clientRoom}, комната была удалена.`)
                socket.leave(data.clientRoom);
                for(i=0;i<room_using.length;i++){
                    if(room_using[i][0]==data.clientRoom){
                        console.log(`Комната ${data.clientRoom} была удалена из массива`)
                        room_using.splice(i,1)
                        console.log(JSON.stringify(room_using))
                        break
                    }
                }
            }
            
        }
    })
});

// Запуск сервера
const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});