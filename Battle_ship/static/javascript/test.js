let field_user=null
let data_o_user
let moving=null
let revenge_user=null
async function take_session() {
    const response = await fetch ('/take_data')
    const data = await response.json();//Data_session.Id, Nick, Win,Loss
    if (data.error) {
        console.log("Ошибка:", data.error);
        return;
    }else{
        console.log("Данные пользователя",data.Data_session)
        data_o_user= data

        socket = io();
        socket.emit('Id_identified', data.Data_session.Id)

        socket.on('serverMsg',(data)=>{
            console.log(`Я в комнате ${data.Room}, поле ${data.fd}`)
            clientRoom = data.Room;
            field_user = data.fd
        })
    
        socket.on('Cann_us',(data)=>{
            User2.textContent = data
        })
        
        socket.on('EventServer', ()=>{//Отобразить цвет на клиете, а также у драгого клиента.
            if(Button.classList.contains("colr")){
                Button.classList.remove("colr")
            }else{
                Button.classList.add("colr")
            }
        })
        socket.on('Play_game',()=>{
            Stop_Timer()
            Expec.style.display="none"
            black.style.display="none"
            end.style.display="none"
            Menu_pos.style.display="block"
            if(field_user==0){
                Menu_pos.classList.add("block_btn_net1")
            }else{
                Menu_pos.classList.add("block_btn_net2")
            }
            
        })
        socket.on('Conn_us', (data)=>{
            User1.innerText=data.User1_Nick
            User2.innerText=data.User2_Nick
        })
        socket.on('field_create',(data)=>{
            console.log(data)
            for(i=0;i<10;i++){
                for(j=0;j<10;j++){
                    if(data[i][j]!=0&&data[i][j]!=1){
                        document.getElementById(i+":"+j+":"+field_user).classList.add("Ship_shadow")
                    }
                }
            }
            Play.style.display="block"
        })
        socket.on('Play_game_ship', (key_play)=>{
            Play.style.display="none"
            expec_game.style.display="none"
            black.style.display="none"
            for(i=0;i<10;i++){
                for(j=0;j<10;j++){
                    if(field_user==0){
                        a_click=1
                        document.getElementById(i+":"+j+":"+a_click).addEventListener('click',Click)
                        document.getElementById(i+":"+j+":"+a_click).addEventListener('mouseover',Mous_hover_on)
                        document.getElementById(i+":"+j+":"+a_click).addEventListener('mouseout',Mous_hover_off)
                    }else{
                        b_click=0
                        document.getElementById(i+":"+j+":"+b_click).addEventListener('click',Click)
                        document.getElementById(i+":"+j+":"+b_click).addEventListener('mouseover',Mous_hover_on)
                        document.getElementById(i+":"+j+":"+b_click).addEventListener('mouseout',Mous_hover_off)
                    }
                }
            }
            if(key_play==0){
                moving = 0
                Move.innerText='>'
            }else{
                moving = 1
                Move.innerText='<'
            }
        })
        socket.on('Result',(data)=>{
            console.log(data)
            if(data.Status=="miss"){
                if(moving==0){
                    moving=1
                    Move.innerText='<'
                }else{
                    moving=0
                    Move.innerText='>'
                }
                document.getElementById(data.coord).classList.add("miss")
            }if(data.Status=="hit"){
                console.log("Попал в корабль по координатам:", data.coord)
                document.getElementById(data.coord).classList.add('hit')
            }if(data.Status=="dead"){
                console.log("Убил корабль:",data.Ship)
                dead_ship(data.Ship)
            }
            /*
            Ship:room_using[i][6].data_ship[j], 
            Status:"dead", 
            Game:"end",
            p:0||1,
            Win: room_using[i][3].Nick,
            ID_user: room_using[i][3].ID_user,
            field:room_using[i][5].field_xy
            */
            if(data.Game=="end"){
                revenge_user=true
                for(i=0;i<10;i++){
                    for(j=0;j<10;j++){
                        if(field_user==0){
                            a_click=1
                            document.getElementById(i+":"+j+":"+a_click).removeEventListener('click',Click)
                            document.getElementById(i+":"+j+":"+a_click).removeEventListener('mouseover',Mous_hover_on)
                            document.getElementById(i+":"+j+":"+a_click).removeEventListener('mouseout',Mous_hover_off)
                        }else{
                            b_click=0
                            document.getElementById(i+":"+j+":"+b_click).removeEventListener('click',Click)
                            document.getElementById(i+":"+j+":"+b_click).removeEventListener('mouseover',Mous_hover_on)
                            document.getElementById(i+":"+j+":"+b_click).removeEventListener('mouseout',Mous_hover_off)
                        }
                    }
                }
                for(i=0;i<10;i++){
                    for(j=0;j<10;j++){
                        att = document.getElementById(i+":"+j+":"+data.p)
                        console.log(att)
                        if(data.field[i][j]!=0 && data.field[i][j]!=1){
                            if(!att.classList.contains("dead")){
                                att.classList.add("Ship_shadow")
                            }
                        }
                    }
                }
                setTimeout(()=>{
                    black.style.display="block"
                    end.style.display="block"
                    USER.innerText=`${data.Win}`
                },8000)
            }
            
        })
        socket.on('clear',()=>{
            Revenge.innerText="Реванш"
            console.log("Очистить")
            moving=null
            revenge_user=null
            for(i=0;i<10;i++){
                for(j=0;j<10;j++){
                    cletka = document.getElementById(i+":"+j+":"+0)
                    if(cletka.classList.contains("Ship_shadow")){cletka.classList.remove("Ship_shadow")}
                    if(cletka.classList.contains("miss")){cletka.classList.remove("miss")}
                    if(cletka.classList.contains("hit")){cletka.classList.remove("hit")}
                    if(cletka.classList.contains("dead")){cletka.classList.remove("dead")}
                    if(cletka.classList.contains("hover_on2")){cletka.classList.remove("hover_on2")}

                    cletka2 = document.getElementById(i+":"+j+":"+1)
                    if(cletka2.classList.contains("Ship_shadow")){cletka2.classList.remove("Ship_shadow")}
                    if(cletka2.classList.contains("miss")){cletka2.classList.remove("miss")}
                    if(cletka2.classList.contains("hit")){cletka2.classList.remove("hit")}
                    if(cletka2.classList.contains("dead")){cletka2.classList.remove("dead")}
                    if(cletka2.classList.contains("hover_on2")){cletka2.classList.remove("hover_on2")}
                }
            }
        })
        socket.on('revenge',(data)=>{
            Revenge.innerText=`Реванш (${data}/2)`
        })
    }
}
/*for(i=0;i<10;i++){
    for(j=0;j<10;j++){

    }
} */


window.addEventListener('DOMContentLoaded', take_session);
console.log("test open")
let socket=null
let activityInterval;
let tim

var sec = 0
var min = 0
var Ship = 0

var Button = document.getElementById("Fast_game")
Button.addEventListener('click',Cre_Con_room);

var Cancel = document.getElementById("cancel")
Cancel.addEventListener('click', cancel)

var Button2 = document.getElementById("Game_frend")

var Button3 = document.getElementById("See")

var Random = document.getElementById("Random")
Random.addEventListener('click', random_pos)
var Play = document.getElementById("Play")
Play.addEventListener('click', play_game)

var Revenge = document.getElementById("Revenge")
Revenge.addEventListener('click', revenge)


var black = document.getElementById("black")
var Menu = document.getElementById("Block_button")
var Expec = document.getElementById("expec")
var Time = document.getElementById("time")
var User1 = document.getElementById("User1")
var User2 = document.getElementById("User2")
var expec_game = document.getElementById("expec_game")
var Move = document.getElementById("Move")
var end = document.getElementById("end")
var USER = document.getElementById("USER")

var Menu_pos = document.getElementById("Block_button_net")

var clientRoom//Комната.

function revenge(){
    if(revenge_user==true){
        console.log("Хочу реванш")
        revenge_user=false
        ID_user = data_o_user.Data_session.Id
        console.log(ID_user)
        socket.emit('Revenge',ID_user)
    }
}

function cancel(){
    Stop_Timer()
    Menu.style.display="block"
    Expec.style.display="none"
    socket.emit('cancel')
}

function Cre_Con_room(){
    Start_Timer()
    Menu.style.display="none"
    Expec.style.display="block"
    socket.emit('cre_con_room',{
        Nick: data_o_user.Data_session.Nick,
        ID_user: data_o_user.Data_session.Id
    })
}

function random_pos(){
    Ship=0
    for(i=0;i<10;i++){
        for(j=0;j<10;j++){
            //Очищаем массив и поле.
            cletka = document.getElementById(i+":"+j+":"+field_user)
            if(cletka.classList.contains("Ship_shadow")){
                cletka.classList.remove("Ship_shadow") //Удаляем палубу на поле.
            }
        }
    }
    socket.emit('Random', {field_user:field_user, ID_user:data_o_user.Data_session.Id})
}


function Stop_Timer(){
    clearInterval(tim)
    sec=0
    min=0
    Time.innerText="0:00"
}

function Start_Timer(){
    tim = setInterval(()=>{
        sec++
        if(sec==60){
            sec=0
            min++
        }
        if(sec<10){
            sec2 = `0${sec}`
        }else{
            sec2 = sec
        }
        if(min<10){
            min2 = `0${min}`
        }else{
            min2 = min
        }
        Time.innerText=`${min2}:${sec2}`
    },1000)
}

function play_game(){
    Menu_pos.style.display="none"
    black.style.display="block"
    expec_game.style.display="block"
    ID_user = data_o_user.Data_session.Id
    socket.emit('Ready',ID_user)
}

function Click(event){
    coord_xy_p = event.srcElement.id.split(":")
    console.log(coord_xy_p)
    if(moving==field_user){
        socket.emit('handleClick',{
            ID_user:data_o_user.Data_session.Id,
            coord_click:coord_xy_p
        })
    }
}

function dead_ship(ship){
    console.log(ship)
    for(i=2;i<ship.length;i++){
        document.getElementById(ship[i]).classList.add('dead')
        coord_xy_p = ship[i].split(":")
        x = Number(coord_xy_p[0])
        y = Number(coord_xy_p[1])
        p = Number(coord_xy_p[2])
        let vr_Check_Ship =[]
        y++ //Сдвиг вправо 1 раз.
        vr_Check_Ship.push([x,y])
        x++//Сдвиг вниз 1 раз.
        vr_Check_Ship.push([x,y])
        for(j=0;j<2;j++){//Сдвиг влево 2 раза.
            y--
            vr_Check_Ship.push([x,y])
        }
        for(j=0;j<2;j++){//Сдвиг вверх 2 раза
            x--
            vr_Check_Ship.push([x,y])
        }
        for(j=0;j<2;j++){//Сдвиг право 2 раза
            y++
            vr_Check_Ship.push([x,y])
        }
        for(j=0;j<vr_Check_Ship.length;j++){
            x= vr_Check_Ship[j][0]
            y= vr_Check_Ship[j][1]
            att= document.getElementById(x+':'+y+':'+p)
            if (x>-1 && x<10){ //9>=x>=0
                if (y>-1 && y<10){ //9>=y>=0
                    if(!att.classList.contains("miss")){
                        att.classList.add("miss")
                    }
                }
                        
            }
        }
    }
}

function Mous_hover_on(event){
    document.getElementById(event.srcElement.id).classList.add("hover_on2")
    
}
function Mous_hover_off(event){
    document.getElementById(event.srcElement.id).classList.remove("hover_on2")
    

}
