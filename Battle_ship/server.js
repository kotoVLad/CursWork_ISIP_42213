const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const session = require('express-session')
app.use(session({
    secret:"Secret",
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:60000*24}
}))
const connection_db = require('./data_base')

const sample = require('./modul/sample')//Шаблон игры: Шаблон поля, поле возможности, общие данные кораблей.

//Импорт маршрутов.
var indexRouter = require('./routes/index');

const { emit } = require('process');
const { Console } = require('console');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Настройка EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'static')));

app.use((req,res,next) =>{
    res.locals.sessionMiddleware= req.session
    next()
})
// Маршрут для главной страницы

app.use('/', indexRouter);

//Soket.io

/*---------------------------------------------------------*/
let client = 0
let key_click = 0

let rooms//Комната

// Обработка подключений Socket.IO

//[[Название комнаты, статус комнаты, //Комната[n][0], status[n][1]...
// user1={Ник,id-user1},user2={Ник,id-user2}, fields{},fiekd_can{},See_field{Видемый поля,для показания поля.}, move=0/1(ход.)]] 
//expec - ожидание, play - игра , end - конец.
let room_using = []//Уже созданные комнаты.  Комната 1 = 0 в массиве и тд.
let vr_field_pos=[]//[[Room,2,{ID, V_G, data_ship},{ID, V_G, data_ship}]]
let userSockets={}
io.on('connection', (socket) => {
    //Тут должны создаваться кастомные ID

    console.log()

    socket.on('Id_identified',(id)=>{//Создаём кастомный id.
        console.log("-----------------------------")
        console.log('Коннект пользователя');
        user = socket.id
        console.log('Id-пользователя:',user);
        ID_user=id
        userSockets[ID_user] = socket
        console.log('Кастомный-Id:',ID_user);
        console.log("-----------------------------")
    })

    socket.on('cre_con_room', (data)=>{//Создаём или присоеденяемся к комнате.
        console.log("-----------------------------")
        Nick=data.Nick
        ID_user=data.ID_user
        key_click++
        client++
        rooms=Math.round(client/2)
        name_room="Room:"+rooms
        if(key_click==1){

            socket.join(name_room)

            console.log("Создана комната:",name_room)
            console.log("Ждём второго игрока.")

            room_using.push([name_room,"expec", 1 ,{Nick:Nick,ID_user:ID_user}])//expec - ожидание, play - игра , end - конец, t_stus - один из них вышел.
            
            console.log(JSON.stringify(room_using))
            console.log("-----------------------------")
            socket.emit('serverMsg', {Room:name_room, fd: 0})//Комната, поле
            
        }else{
            socket.join(name_room)
            socket.emit('serverMsg', {Room:name_room, fd: 1})//Комната, поле

            key_click=0
            console.log("Второй игрок зашёл в комнту:",name_room)
            for(i=0;i<room_using.length;i++){
                if(room_using[i][0]==name_room){
                    console.log("Всё ок.")
                    room_using[i].push(
                        {Nick:Nick,ID_user:ID_user},
                        {
                            field_xy: JSON.parse(JSON.stringify(sample.field_xy)),
                            field_CanShot: JSON.parse(JSON.stringify(sample.field_CanShot)),
                            data_ship: JSON.parse(JSON.stringify(sample.data_ship))
                        },
                        {
                            field_xy: JSON.parse(JSON.stringify(sample.field_xy)),
                            field_CanShot: JSON.parse(JSON.stringify(sample.field_CanShot)),
                            data_ship: JSON.parse(JSON.stringify(sample.data_ship))
                        },
                        {
                            See_field1: JSON.parse(JSON.stringify(sample.field_xy)),
                            See_field2: JSON.parse(JSON.stringify(sample.field_xy))
                        },
                        0
                    )
                    room_using[i][1] = "play"
                    room_using[i][2] = 2

                    console.log("Отправка Ников.")

                    use1 = room_using[i][3].ID_user//id 1 пользователя комнаты
                    use2 = room_using[i][4].ID_user//id 2 пользователя комнаты

                    Room_Users = {User1_Nick:room_using[i][3].Nick, User2_Nick:room_using[i][4].Nick}

                    socket = userSockets[use1];//Soket 1 пользователя комнаты
                    socket.emit('Conn_us', Room_Users)

                    socket = userSockets[use2];//Soket 2 пользователя комнаты
                    socket.emit('Conn_us', Room_Users)
                    break
                }
            }
            // console.log(JSON.stringify(room_using))
            console.log(room_using)
            console.log("-----------------------------")
            io.to(name_room).emit('Play_game')
        }

        console.log("-----------------------------")
        Users = Object.keys(userSockets)
        console.log("Текущие пользователи:", Users);
        console.log("-----------------------------")
    })

    socket.on('mouseover', (data)=>{
        for(i=0;i<room_using.length;i++){
            if(room_using[i][3].ID_user==data.ID_user||room_using[i][4].ID_user==ID_user){

            }
            
        }
    })

    socket.on('position',(ID_user)=>{
        console.log("-----------------------------")
        var not = 0
        let vr_room
        for(i=0;i<room_using.length;i++){
            if(room_using[i][3].ID_user==ID_user||room_using[i][4].ID_user==ID_user){
                vr_room = room_using[i][0]
                break
            }
        }
        console.log("Комната пользовтеля:",vr_room)
        if(vr_field_pos.length!=0){
            console.log("-----------------------------")
            console.log("Что-то есть.")
            for(i=0;i<vr_field_pos.length;i++){
                if(vr_field_pos[i][0]==vr_room){//да //Есть ли в нём название Комнаты в массиве
                    console.log(`Комната ${vr_room} найдена во временном.`)
                    if(vr_field_pos[i][1]==1){
                        if(vr_field_pos[i][2].ID_user==ID_user){
                            console.log("Есть такой пользователь, он 1, так что будет заменна.")
                            for(j=0;j<room_using.length;j++){
                                if(room_using[j][0]==vr_room){
                                    if(room_using[j][3].ID_user==ID_user){
                                        room_using[j][5].field_xy=JSON.parse(JSON.stringify(sample.field_xy))
                                        console.log("1. Успешно")
                                    }
                                    if(room_using[j][4].ID_user==ID_user){
                                        room_using[j][6].field_xy=JSON.parse(JSON.stringify(sample.field_xy))
                                        console.log("2. Успешно")
                                    }
                                }
                            }
                            vr_field_pos[i][2].data_ship=JSON.parse(JSON.stringify(sample.data_ship))
                        }else{
                            console.log("Нет такого пользователя, так что создадим 2-го в комнате во временном массиве.")
                            vr_field_pos[i][1]=2
                            vr_field_pos[i].push(
                                {
                                    ID_user:ID_user,
                                    V_G:0,// 0-горизонтальный 1-вертикальный.
                                    data_ship:JSON.parse(JSON.stringify(sample.data_ship))
                                }
                            )
                        }
                    }else{
                        console.log("В комнате 2 человека, кто-то хочет сделать замену.")
                        for(j=0;j<room_using.length;j++){
                            if(room_using[j][0]==vr_room){
                                if(room_using[j][3].ID_user==ID_user){
                                    room_using[j][5].field_xy=JSON.parse(JSON.stringify(sample.field_xy))
                                    console.log("1. Успешно")
                                }
                                if(room_using[j][4].ID_user==ID_user){
                                    room_using[j][6].field_xy=JSON.parse(JSON.stringify(sample.field_xy))
                                    console.log("2. Успешно")
                                }
                            }
                        }
                        if(vr_field_pos[i][2].ID_user==ID_user){
                            vr_field_pos[i][2].data_ship=JSON.parse(JSON.stringify(sample.data_ship))
                            console.log("1.1. Успешно")
                        }
                        if(vr_field_pos[i][3].ID_user==ID_user){
                            vr_field_pos[i][3].data_ship=JSON.parse(JSON.stringify(sample.data_ship))
                            console.log("2.1. Успешно")
                        }
                    }
                    break
                }else{
                    not++
                    if(vr_field_pos.length==not){//Нет//Новый
                        console.log(`Нет комнаты ${vr_room} найдена во временном массиве.`)
                        console.log("Создать комнату во временном массиве")
                        vr_field_pos.push([
                            vr_room,
                            1,
                            {
                                ID_user:ID_user,
                                V_G:0,// 0-горизонтальный 1-вертикальный.
                                data_ship:JSON.parse(JSON.stringify(sample.data_ship))
                            }
                        ])
                    }
                }
                
            }
        }else{
            console.log("Нет существующих комнат во временном массиве")
            console.log("Создать комнату во временном массиве")
            vr_field_pos.push([//Новый
                vr_room,
                1,
                {
                    ID_user:ID_user,
                    V_G:0,// 0-горизонтальный 1-вертикальный.
                    data_ship:JSON.parse(JSON.stringify(sample.data_ship))
                }
            ])
        }
        console.log(vr_field_pos)
        console.log("-----------------------------")
    })

    socket.on('ButtonClick',clientRoom=>{//Отображаем в комнате изменения.
        io.to(clientRoom).emit('EventServer')//Отобразить у всех действие.
    })

    socket.on('Random', (data)=>{
        console.log("-----------------------------")
        console.log(JSON.stringify(data))
        let field_open_user = Random(data)
        socket.emit('field_create', field_open_user)
    })
    socket.on('cancel',()=>{
        name_room="Room:"+rooms
        for(i=0;i<room_using.length;i++){
            if(room_using[i][0]==name_room){
                console.log(`Комната ${room_using[i][0]} была удалина из массиве.`)
                socket.leave(room_using[i][0]);
                room_using.splice(i,1)
            }
        }
        socket.leave(name_room);
        key_click=0
        client--
        console.log(`Поиск был отменинё в комнате ${name_room}`)
        console.log(JSON.stringify(room_using))
    })

    socket.on('Ready',(data)=>{
        for(i=0;i<room_using.length;i++){
            if(room_using[i][3].ID_user==data||room_using[i][4].ID_user==data){
                att = room_using[i].length - 1
                rd = room_using[i][att]
                rd++
                console.log(`Готов ${rd}`)
                if(rd==2){
                    var rd = Math.round(Math.random()) //Рандомное число от 0 до 1
                    room_using[i][room_using[i].length - 1] = rd
                    io.to(room_using[i][0]).emit('Play_game_ship', rd)
                }else{
                    room_using[i][att] = rd
                }
                break
            }
        }
    })
    
    socket.on('handleClick',(data)=>{//id, coord
        for(i=0;i<room_using.length;i++){
            if(room_using[i][3].ID_user==data.ID_user||room_using[i][4].ID_user==data.ID_user){
                console.log("Чей-то выстрел")
                coord=data.coord_click//x,y,p
                att = room_using[i].length - 1//Последняя элемент комныты в массиве.
                rd = room_using[i][att]//Чей ход
                let resl//Результат выстела
                if(coord[2]==1){//Выстрел первого человека
                    console.log("Выстрел 1-го игрока.")
                    arr = room_using[i][6].field_xy//Поле 2-го игрока.
                    data_ship_user = room_using[i][6].data_ship//Данные кораблей 2-го игрока.
                    field_C_S = room_using[i][6].field_CanShot//Поля куда можно стрелять.
                    Se_field = room_using[i][7].See_field2//Видемае поля
                    if(field_C_S[coord[0]][coord[1]]==true){
                        room_using[i][6].field_CanShot[coord[0]][coord[1]]=false
                        if(arr[coord[0]][coord[1]]!=0 && arr[coord[0]][coord[1]]!=1){//Попал
                            console.log('Попал')
                            for(j=0;j<10;j++){
                                if(data_ship_user[j][0]==arr[coord[0]][coord[1]]){
                                    room_using[i][6].data_ship[j][1]=data_ship_user[j][1]-1
                                    room_using[i][6].data_ship[j].push(`${coord[0]}:${coord[1]}:${coord[2]}`)
                                    console.log("Попал", room_using[i][6].data_ship[j])
                                    if(room_using[i][6].data_ship[j][1]==0){
                                        room_using[i][7].See_field2[coord[0]][coord[1]]="h"
                                        room_using[i][6].data_ship[j][1] = "dead"
                                        resl={Ship:room_using[i][6].data_ship[j], Status:"dead"}
                                        console.log("Убит", resl.Ship)
                                        //Нужно сделать Функцию обводки вокруг корабля.
                                        dead_ship({//Все данные второго поля.
                                            Room:i,
                                            Ship:j,
                                            fiel:6,
                                            See_fiel:7
                                        })
                                        if(check_dead_win({Room:i,Ship:j,fiel:6})==true){
                                            resl={
                                                Ship:room_using[i][6].data_ship[j], 
                                                Status:"dead", 
                                                Game:"end",
                                                p:0,
                                                Win: room_using[i][3].Nick,
                                                ID_user: room_using[i][3].ID_user,
                                                field:room_using[i][5].field_xy 
                                            }
                                            id = room_using[i][3].ID_user
                                            connection_db.addwin(id,(err)=>{
                                                if(err){
                                                    console.log(err)
                                                }else{
                                                    console.log(`Выйграл пользователь с id:${id}`)
                                                }
                                            })
                                            id = room_using[i][4].ID_user
                                            connection_db.addloss(id,(err)=>{
                                                if(err){
                                                    console.log(err)
                                                }else{
                                                    console.log(`Проиграл пользователь с id:${id}`)
                                                }
                                            })
                                        }
                                    }else{
                                        room_using[i][7].See_field2[coord[0]][coord[1]]="h"
                                        resl={coord:`${coord[0]}:${coord[1]}:${coord[2]}` ,Status:"hit"}
                                    }
                                    break
                                }
                            }

                        }else{//Мимо
                            console.log("Мимо.")
                            room_using[i][7].See_field2[coord[0]][coord[1]]="m"
                            resl={coord:`${coord[0]}:${coord[1]}:${coord[2]}` ,Status:"miss"}
                            //Нужно сделать мимо.
                        }
                        io.to(room_using[i][0]).emit('Result', resl)
                    }else{
                        console.log("Сюда нет смысла стрелять.")
                    }
                }else{
                    console.log("Выстрел 2-го игрока.")
                    arr = room_using[i][5].field_xy//Поле 1-го игрока.
                    data_ship_user = room_using[i][5].data_ship//Данные кораблей 1-го игрока.
                    field_C_S = room_using[i][5].field_CanShot//Поля куда можно стрелять.
                    Se_field = room_using[i][7].See_field1//Видемае поля
                    if(field_C_S[coord[0]][coord[1]]==true){
                        room_using[i][5].field_CanShot[coord[0]][coord[1]]=false
                        if(arr[coord[0]][coord[1]]!=0 && arr[coord[0]][coord[1]]!=1){//Попал
                            console.log('Попал')
                            for(j=0;j<10;j++){
                                if(data_ship_user[j][0]==arr[coord[0]][coord[1]]){
                                    room_using[i][5].data_ship[j][1]=data_ship_user[j][1]-1
                                    room_using[i][5].data_ship[j].push(`${coord[0]}:${coord[1]}:${coord[2]}`)
                                    console.log("Попал", room_using[i][5].data_ship[j])
                                    if(room_using[i][5].data_ship[j][1]==0){
                                        room_using[i][7].See_field1[coord[0]][coord[1]]="h"
                                        room_using[i][5].data_ship[j][1] = "dead"
                                        resl={Ship:room_using[i][5].data_ship[j], Status:"dead"}
                                        console.log("Убит", resl.Ship)
                                        //Нужно сделать Функцию обводки вокруг корабля.
                                        dead_ship({//Все данные второго поля.
                                            Room:i,
                                            Ship:j,
                                            fiel:5,
                                            See_fiel:7
                                        })
                                        if(check_dead_win({Room:i,Ship:j,fiel:5})==true){
                                            resl={
                                                Ship:room_using[i][5].data_ship[j], 
                                                Status:"dead", 
                                                Game:"end",
                                                p:1,
                                                Win: room_using[i][4].Nick,
                                                ID_user: room_using[i][4].ID_user,
                                                field:room_using[i][6].field_xy 
                                            }
                                            id = room_using[i][4].ID_user
                                            connection_db.addwin(id,(err)=>{
                                                if(err){
                                                    console.log(err)
                                                }else{
                                                    console.log(`Выйграл пользователь с id:${id}`)
                                                }
                                            })
                                            id = room_using[i][3].ID_user
                                            connection_db.addloss(id,(err)=>{
                                                if(err){
                                                    console.log(err)
                                                }else{
                                                    console.log(`Проиграл пользователь с id:${id}`)
                                                }
                                            })
                                        }
                                        
                                    }else{
                                        room_using[i][7].See_field1[coord[0]][coord[1]]="h"
                                        resl={coord:`${coord[0]}:${coord[1]}:${coord[2]}` ,Status:"hit"}
                                    }
                                    break
                                }
                            }

                        }else{//Мимо
                            console.log("Мимо.")
                            room_using[i][7].See_field1[coord[0]][coord[1]]="m"
                            resl={coord:`${coord[0]}:${coord[1]}:${coord[2]}` ,Status:"miss"}
                            //Нужно сделать мимо.
                        }
                        console.log("Поле 1",room_using[i][7].See_field1)
                        io.to(room_using[i][0]).emit('Result', resl)
                    }else{
                        console.log("Сюда нет смысла стрелять.")
                    }
                }
                break
            }
        }
    })
    socket.on('Revenge', (ID_user)=>{
        console.log("Запрос")
        for(i=0;i<room_using.length;i++){
            if(room_using[i][3].ID_user==ID_user||room_using[i][4].ID_user==ID_user){
                console.log("Хочу реванш")
                att = room_using[i].length - 1//Последняя элемент комныты в массиве.
                rd = room_using[i][att]
                if(rd==0){
                    room_using[i][att]=1
                    io.to(room_using[i][0]).emit('revenge',room_using[i][att])
                }else{
                    if(room_using[i][1]!="---"){
                        room_using[i][att]=0

                        room_using[i][5].field_xy = JSON.parse(JSON.stringify(sample.field_xy))
                        room_using[i][6].field_xy = JSON.parse(JSON.stringify(sample.field_xy))

                        room_using[i][5].field_CanShot = JSON.parse(JSON.stringify(sample.field_CanShot))
                        room_using[i][6].field_CanShot = JSON.parse(JSON.stringify(sample.field_CanShot))

                        room_using[i][5].data_ship = JSON.parse(JSON.stringify(sample.data_ship))
                        room_using[i][6].data_ship = JSON.parse(JSON.stringify(sample.data_ship))

                        room_using[i][7].See_field1 = JSON.parse(JSON.stringify(sample.field_xy))
                        room_using[i][7].See_field2 = JSON.parse(JSON.stringify(sample.field_xy))
                        
                        room_using[i][1] = "play"
                        console.log("---1---")
                        io.to(room_using[i][0]).emit('clear')
                        console.log("---2---")
                        io.to(room_using[i][0]).emit('Play_game')
                        break
                    }
                }
            }else{
                console.log("Ненашёл комнату")
            }
        }
    })
    socket.on('Log_out_Room',(ID_user)=>{
        for(i=0;i<room_using.length;i++){
            if(room_using[i][3].ID_user==ID_user||room_using[i][4].ID_user==ID_user){
                console.log("Кто-то вышел из комнаты.")
                room_using[i][1]="---"

                if(room_using[i][3].ID_user==ID_user){
                    room_using[i][3].ID_user="---"
                }if(room_using[i][4].ID_user==ID_user){
                    room_using[i][4].ID_user="---"
                }
                socket.leave(room_using[i][0]);

                us = room_using[i][2]
                us--
                room_using[i][2] = us
                if(room_using[i][2]==1){
                    io.to(room_using[i][0]).emit('no_revang')
                }
                socket.emit('clear')
                if(room_using[i][2]==0){
                    room_using.splice(i,1)
                }
            }
        }
    })
    socket.on('Give_up',(ID_user)=>{
        console.log("Кто-то сдался")
        for(i=0;i<room_using.length;i++){
            if(room_using[i][3].ID_user==ID_user){
                console.log("Сдался пользовтель с ID:", ID_user)
                resl={
                    Status:"Giv",
                    Game:"end",
                    p:1,
                    Win: room_using[i][4].Nick,
                    ID_user: room_using[i][4].ID_user
                }
                id = room_using[i][4].ID_user
                connection_db.addwin(id,(err)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log(`Выйграл пользователь с id:${id}`)
                    }
                })
                id = room_using[i][3].ID_user
                connection_db.addloss(id,(err)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log(`Проиграл пользователь с id:${id}`)
                    }
                })
                att = room_using[i].length - 1//Последний элемент комныты в массиве.
                room_using[i][att]=0
                room_using[i][1]="end"
                io.to(room_using[i][0]).emit('Result', resl)
                break
            }if(room_using[i][4].ID_user==ID_user){
                console.log("Сдался пользовтель с ID:", ID_user)
                resl={ 
                    Status:"Giv",
                    Game:"end",
                    p:0,
                    Win: room_using[i][3].Nick,
                    ID_user: room_using[i][3].ID_user 
                }
                id = room_using[i][3].ID_user
                connection_db.addwin(id,(err)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log(`Выйграл пользователь с id:${id}`)
                    }
                })
                id = room_using[i][4].ID_user
                connection_db.addloss(id,(err)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log(`Проиграл пользователь с id:${id}`)
                    }
                })
                att = room_using[i].length - 1//Последний элемент комныты в массиве.
                room_using[i][att]=0
                room_using[i][1]="end"
                io.to(room_using[i][0]).emit('Result', resl)
                break
            }
        }
    })
    socket.on('No_revang',(ID_user)=>{
        console.log("Вышел из комнаты кто-то.")
        for(i=0;i<room_using.length;i++){
            if(room_using[i][3].ID_user==ID_user||room_using[i][4].ID_user==ID_user){
                room_using[i][1]="---"

                if(room_using[i][3].ID_user==ID_user){
                    room_using[i][3].ID_user="---"
                }if(room_using[i][4].ID_user==ID_user){
                    room_using[i][4].ID_user="---"
                }
                socket.leave(room_using[i][0]);

                us = room_using[i][2]
                us--
                room_using[i][2] = us
                if(room_using[i][2]==1){
                    io.to(room_using[i][0]).emit('no_revang')
                }
                socket.emit('clear')
                if(room_using[i][2]==0){
                    room_using.splice(i,1)
                }
                break
            }
        }
    })
    socket.on("disconnect", () => {//Выход
        console.log('Пользователь отключился');
        // Удаляем отключённый сокет
        for (const [id, sock] of Object.entries(userSockets)) {
          if (sock === socket) {
            for(i=0;i<room_using.length;i++){//Проверяем, есть ли пользователь в комнате.
                if(room_using[i][3].ID_user==id||room_using[i][4].ID_user==id){//3 4
                    console.log(`Пользователь ${id} вышел`);
                    if(room_using[i][1]=="expec"){// Пользователь вышел, не начав игру в комнате.
                        console.log("expec")
                        console.log(`Комната ${room_using[i][0]} была удалина из массиве.`)
                        socket.leave(room_using[i][0]);
                        room_using.splice(i,1)
                        key_click=0
                        client--
                        break
                    }
                    if(room_using[i][1]=="end"||room_using[i][1]=="---"){
                        console.log("end")
                        if(room_using[i][3].ID_user==id){
                            room_using[i][3].ID_user="---"
                        }if(room_using[i][4].ID_user==id){
                            room_using[i][4].ID_user="---"
                        }
                        socket.leave(room_using[i][0]);
                        us = room_using[i][2]
                        us--
                        room_using[i][2] = us
                        io.to(room_using[i][0]).emit('no_revang')
                        if(room_using[i][2]==0){
                            console.log(`Комната ${room_using[i][0]} была удалина из массиве.`)
                            room_using.splice(i,1)
                        }
                        break
                    }
                    if(room_using[i][1]=="play"||room_using[i][1]=="t_stusy"){
                        console.log("play-t_stusy")
                        room_using[i][1] = "t_stusy"
                        console.log(`Пользователь ${id} вышел из игры.`);
                        socket.leave(room_using[i][0]);
                        us = room_using[i][2]
                        us--
                        room_using[i][2] = us
                        if(room_using[i][2]==0){
                            console.log(`Игра была отменина в комнате: ${room_using[i][0]}. `)
                            room_using.splice(i,1)
                        }
                        break
                    }
                }
            }
            delete userSockets[id];
            console.log(`Пользователь ${id} отключён`);
            break;
          }
        }
    });
});

//Обводка
function dead_ship(data){// Room:i, Ship:j, fiel:6, See_fiel:7 
    // Ship:room_using[Room][fiel].data_ship[Ship],                       //Корабли
    // Can:room_using[Room][fiel].field_CanShot,                          //Можно по ней стрелять
    // See:room_using[Room][See_fiel].See_field1||See_field2 (p = 0 || 1) //Видемые поля
    console.log("-------------------------------------")
    console.log("Обводка.")
    ship_deck = room_using[data.Room][data.fiel].data_ship[data.Ship]//Корабль.
    console.log("-------------------------------------")
    console.log(ship_deck)
    console.log("-------------------------------------")
    for(g=2;g<ship_deck.length;g++){
        coord_xy_p = ship_deck[g].split(":")
        console.log(coord_xy_p)
        x = Number(coord_xy_p[0])
        y = Number(coord_xy_p[1])
        p = Number(coord_xy_p[2])//Протокол поля, на котором воздействуют. (Определяет поле)
        if(p==1){
            room_using[data.Room][data.See_fiel].See_field2[x][y]="d"
        }else{
            room_using[data.Room][data.See_fiel].See_field1[x][y]="d"
        }
        let vr_Check_Ship =[]
        y++ //Сдвиг вправо 1 раз.
        vr_Check_Ship.push([x,y])
        x++//Сдвиг вниз 1 раз.
        vr_Check_Ship.push([x,y])
        for(h=0;h<2;h++){//Сдвиг влево 2 раза.
            y--
            vr_Check_Ship.push([x,y])
        }
        for(h=0;h<2;h++){//Сдвиг вверх 2 раза
            x--
            vr_Check_Ship.push([x,y])
        }
        for(h=0;h<2;h++){//Сдвиг право 2 раза
            y++
            vr_Check_Ship.push([x,y])
        }
        for(h=0;h<vr_Check_Ship.length;h++){
            x= vr_Check_Ship[h][0]
            y= vr_Check_Ship[h][1]
            if (x>-1 && x<10){ //9>=x>=0
                if (y>-1 && y<10){ //9>=y>=0
                    room_using[data.Room][data.fiel].field_CanShot[x][y] = false
                    if(p==1){
                        room_using[data.Room][data.See_fiel].See_field2[x][y]="m"
                    }else{
                        room_using[data.Room][data.See_fiel].See_field1[x][y]="m"
                    }
                }
                        
            }
        }
    }
    //Отправка во всех массивы.
    console.log("Конец")
    console.log("-------------------------------------")
}

function Random(data){//(В)Создание кораблей по методу рандома.
    console.log("-----------------------------")
    console.log("Рандом.")
    // 0 - горизонталь; 1 - вертекаль
    //remove('active')
    //Добавить отчистку, если игрок решит заново пересгенерировать положение кораблей.
    console.log(JSON.stringify(data))
    console.log("-----------------------------")
    console.log("Пустое поле.")
    console.log(sample.field_xy)
    console.log("-----------------------------")
    test=1
    let vr_field = JSON.parse(JSON.stringify(sample.field_xy));
    ships = sample.data_ship
    for(r=0;r<10;r++){
        console.log(test)
        test++
        Name_Ship = ships[r][0]//Название корабля.
        dask = ships[r][1]//Кол-во палуб.
        let vr_coord =[]//Временый массив, мнимых координат корабля на поле.
        Wh_tf=true
        /* 
            Цикл while нужен, чтобы генерировать координаты и проверять(функция checkShipBoard), можно ли на этих координатах ставить корабль.
            Есла "да", то выполнится функция и прервётся цикл while.
            Если "нет", то цикл не завершится и заново будет генерировать координаты.
        */
        while(Wh_tf == true){
            var xy = Math.round(Math.random()) //Рандомное число от 0 до 1
            if (xy==0){ // 0 - горизонталь
                min = 0
                max = 9
                x = Math.floor(Math.random() * (max - min + 1)) + min
                y = Math.floor(Math.random() * (max - dask - min + 2)) + min;//Диапозон с учётом с размером корабля.
                absl = max - dask+1 //Максимум по координатам, котором можно поставить корабль,
                                    //чтобы не зайти за поле.
                alf = dask//Временный массив координат кораблей.
                
                /*--------------------------------------------------------------------------------- */
        
                //Из первой координаты создаём уже сам корабль.
                for (i=0;i<alf;i++){
                    
                    vr_coord[i] = [x,y]//Координаты временного массива.
                    y= y+1
                }
        
                
            }else{     // 1 - вертекаль
                min = 0 
                max = 9
                x = Math.floor(Math.random() * (max - dask - min + 2)) + min;//Диапозон с учётом с размером корабля.
                y = Math.floor(Math.random() * (max - min + 1)) + min
                absl = max - dask+1
                alf = dask//Координаты временного массива.
        
                /*--------------------------------------------------------------------------------- */
        
                //Из первой координаты создаём уже сам корабль.
                for (i=0;i<alf;i++){
                    vr_coord[i] = [x,y]
                    x= x+1
                }    
            }
            if(checkShipBoard(vr_coord, vr_field)==true){
                
                for(r1=0;r1<vr_coord.length;r1++){
                    x5=vr_coord[r1][0]
                    y5=vr_coord[r1][1]
                    //document.getElementById(x5+";"+y5).classList.add("Ship_shadow")
                    vr_field[x5][y5] = Name_Ship
                }
                for(c=0;c<vr_coord.length;c++){ //Обводка вокруг корабля.
                    let vr_Check_Ship =[]
                    //Начальные координаты палубы корабля.
                    x1=vr_coord[c][0]
                    y1=vr_coord[c][1]
                    y1=y1+1 //Сдвиг вправо 1 раз.
                    vr_Check_Ship.push([x1,y1])
                    x1=x1+1//Сдвиг вниз 1 раз.
                    vr_Check_Ship.push([x1,y1])
                    for(t=0;t<2;t++){//Сдвиг влево 2 раза.
                        y1=y1-1
                        vr_Check_Ship.push([x1,y1])
                    }
                    for(tg=0;tg<2;tg++){//Сдвиг вверх 2 раза
                        x1=x1-1
                        vr_Check_Ship.push([x1,y1])
                    }
                    for(th=0;th<2;th++){//Сдвиг право 2 раза
                        y1=y1+1
                        vr_Check_Ship.push([x1,y1])
                    }
                    //console.log(vr_Check_Ship) //Координаты вокруг клетки.
            
                    //Проверка координат, чтобы пометить поле возле корабля.
                    for(chk=0;chk<vr_Check_Ship.length;chk++){
                        x2= vr_Check_Ship[chk][0]
                        y2= vr_Check_Ship[chk][1]
                        if (x2>-1 && x2<10){ //9>=x2>=0
                            if (y2>-1 && y2<10){
                                if(vr_field[x2][y2]==0){
                                    vr_field[x2][y2] = 1
                                }
                            }
                            
                        }
                    }
            
                }
                Wh_tf = false
            }

        }//Конец цикла while
        
    }//Конец цикла for
    console.log(vr_field)
    console.log("-----------------------------")
    for(i=0;i<room_using.length;i++){
        if(room_using[i][3].ID_user==data.ID_user||room_using[i][4].ID_user==data.ID_user){
            if(data.field_user==0){//5 //user[3]
                room_using[i][5].field_xy = JSON.parse(JSON.stringify(vr_field));
                console.log("Отправить 1-ому пользователю.")
                return vr_field
            }else{//6 //user[4]
                room_using[i][6].field_xy = JSON.parse(JSON.stringify(vr_field));
                console.log("Отправить 2-ому пользователю.")
                return vr_field
            }
        }
    }
    

}
function checkShipBoard(vr_coord, vr_field){ //Проверяем можно ли поставить корабль
    Can=0
    for(i=0;i<vr_coord.length;i++){
        x4= vr_coord[i][0]
        y4= vr_coord[i][1]
        if(x4<10 && x4>-1){
            if(y4<10 && y4>-1){
                if(vr_field[x4][y4] == 0){
                    Can=Can+1    
                }else {
                    break;
                }
            }else{
                break;
            }
        }else{
            break;
        }
        
    }
    if(Can==vr_coord.length){
        return true;
    }else{
        return false;
    } 
    


}
function check_dead_win(data){
    can = 0
    data_ships = room_using[data.Room][data.fiel].data_ship
    console.log(data_ships)
    for(w=0;w<10;w++){
        console.log(data_ships[w])
        if(data_ships[w][1]=="dead"){
            can++
        }else{
            break
        }
    }
    console.log(can)
    if(can==10){
        console.log("Целых кораблей не осталось.")
        att = room_using[data.Room].length - 1//Последний элемент комныты в массиве.
        room_using[data.Room][att]=0
        room_using[data.Room][1]="end"
        console.log(room_using[data.Room])
        return true
    }else{
        return false
    }
}
// Запуск сервера
const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});