let field_user=null
let data_o_user
let moving=null
let revenge_user=null
let key_position = false

let coom_len=null

User_status = null
async function take_session() {
    const response = await fetch ('/take_data')
    const data = await response.json();// data_o_user // Data_session.Id, Nick, Win,Loss
    if (data.error) {
        console.log("Ошибка:", data.error);
        return;
    }else{
        console.log("Данные пользователя",data.Data_session)
        data_o_user= data

        socket = io();
        socket.emit('Id_identified', data.Data_session.Id)

        socket.on('serverMsg',(data)=>{
            coom_len = data.Room
            console.log(`Я в комнате ${data.Room}, поле ${data.fd}`)
            ROOM.innerText = data.Room
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
            col_2.style.display="none"
            col__4.style.display="none"

            key_position = true
            Expec.style.display="none"
            black.style.display="none"
            end.style.display="none"
            Crear_Con_Prem.style.display="none"
            bt_c_c_l.style.display="none"
            cancel2.style.display="none"

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
            mine_Menu.style.display="block"
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
                mine_Menu.style.display="none"
                Move.innerText='Конец.'
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
                if(data.Status!="Giv"){
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
                }
                setTimeout(()=>{
                    black.style.display="block"
                    end.style.display="block"
                    if(coom_len.length<10){
                        console.log("<")
                        col_2.style.display="block"
                    }if(coom_len.length>10){
                        console.log(">")
                        col__4.style.display="block"
                    }
                    USER.innerText=`${data.Win}`
                },6000)
            }
            
        })
        socket.on('clear',()=>{
            Revenge.innerText="Реванш"
            Revenge4.innerText="Реванш"
            console.log("Очистить")
            moving=null
            revenge_user=null
            Delet_class()
            
        })
        socket.on('revenge',(data)=>{
            Revenge.innerText=`Реванш (${data}/2)`
        })
        socket.on('no_revang',()=>{
            revenge_user=false
            Revenge.innerText=`Реванш не возможен.`
            Revenge4.innerText=`Реванш не возможен.`
        })
        socket.on('Resl_pos',(data)=>{
            if(data.Status=="All_ship"){
                Play.style.display="block"
            }
            if(data.Status=="Can"){
                for(i=0;i<data.vr_coord.length;i++){
                    x = data.vr_coord[i][0]
                    y = data.vr_coord[i][1]
                    document.getElementById(x+":"+y+":"+field_user).classList.add("Hover_on")
                }
            }else{
                for(i=0;i<data.vr_coord.length;i++){
                    x = data.vr_coord[i][0]
                    y = data.vr_coord[i][1]
                    if(x<10 && x>-1){
                        if(y<10 && y>-1){
                            document.getElementById(x+":"+y+":"+field_user).classList.add("Hover_on_red")
                        }
                    }
                }
            }
        })
        socket.on('Create_ship',(data)=>{
            if(data.Status=="yes"){
                for(i=0;i<data.vr_coord.length;i++){
                    x=data.vr_coord[i][0]
                    y=data.vr_coord[i][1]
                    document.getElementById(x+":"+y+":"+field_user).classList.add("Ship_shadow")
                }
            }
            if(data.Status=="end"){
                console.log("Все корабли расставлены.")
                Play.style.display="block"
                for(i=0;i<data.vr_coord.length;i++){
                    x=data.vr_coord[i][0]
                    y=data.vr_coord[i][1]
                    document.getElementById(x+":"+y+":"+field_user).classList.add("Ship_shadow")
                }
                Delet_handler_pos()
            }
        })
        socket.on('cancellation',()=>{
            if(key_position = false){
                Delet_handler_pos()
            }
            Menu_pos.style.display="none"
            expec_game.style.display="none"

            black.style.display="block"
            cancell_game.style.display="block"
        })
        socket.on('Recon', (data)=>{
            black.style.display="none"
            Menu.style.display="none"
            mine_Menu.style.display="block"
            moving = data.move
            field_user = data.prot
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
            for(i=0;i<10;i++){
                for(j=0;j<10;j++){
                    if(data.field_see[i][j]!=0 && data.field_see[i][j]!=1){
                        document.getElementById(i+":"+j+":"+field_user).classList.add("Ship_shadow")
                    }
                }
            }
            User1.innerText=data.Nick1
            User2.innerText=data.Nick2
            if(moving == 0){
                Move.innerText='>'
            }else{
                Move.innerText='<'
            }
            console.log(data.See_field1)
            console.log(data.See_field2)
            for(i=0;i<10;i++){
                for(j=0;j<10;j++){
                    if(data.See_field1[i][j]!=0){
                        if(data.See_field1[i][j]=="m"){
                            document.getElementById(i+":"+j+":"+0).classList.add("miss")
                        }if(data.See_field1[i][j]=="h"){
                            document.getElementById(i+":"+j+":"+0).classList.add("hit")
                        }if(data.See_field1[i][j]=="d"){
                            document.getElementById(i+":"+j+":"+0).classList.add("dead")
                        }
                    }
                    if(data.See_field2[i][j]!=0){
                        if(data.See_field2[i][j]=="m"){
                            document.getElementById(i+":"+j+":"+1).classList.add("miss")
                        }if(data.See_field2[i][j]=="h"){
                            document.getElementById(i+":"+j+":"+1).classList.add("hit")
                        }if(data.See_field2[i][j]=="d"){
                            document.getElementById(i+":"+j+":"+1).classList.add("dead")
                        }
                    }
                }
            }
        })
        socket.on('err_status', (Status)=>{
            err_status.style.display="block"
            err_status.innerText = Status
            setTimeout(()=>{
                err_status.style.display="none"
            },2000)
        })
        socket.on('serverMsg_prem',(data)=>{
            ROOM.innerText = data.Room
            coom_len = data.Room
            text2.innerText=`Отправте друго id: ${data.Room} (только цифры)`
            field_user = data.fd
            bt_c_c_l.style.display="none"
            cancel2.style.display="block"
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

var Button3 = document.getElementById("See")

var Random = document.getElementById("Random")
Random.addEventListener('click', random_pos)
var Play = document.getElementById("Play")
Play.addEventListener('click', play_game)

var Revenge = document.getElementById("Revenge")
Revenge.addEventListener('click', revenge)

var Revenge4 = document.getElementById("Revenge4")
Revenge4.addEventListener('click', revenge4)

var New_game = document.getElementById("New_game")
New_game.addEventListener('click', new_game)

var New_game2 = document.getElementById("New_game2")
New_game2.addEventListener('click', new_game2)

var m_m1 = document.getElementById("m_m1")
m_m1.addEventListener('click', Open_menu)

var set = document.getElementById("set")
set.addEventListener('click', Open_set)
var give_up = document.getElementById("give_up")
give_up.addEventListener('click', Give_up)

var yes = document.getElementById("Yes")
yes.addEventListener('click', Yes)

var no = document.getElementById("No")
no.addEventListener('click', No)

var Log_out = document.getElementById("Log_out")
Log_out.addEventListener('click', log_out)

var Log_out2 = document.getElementById("Log_out2")
Log_out2.addEventListener('click', log_out2)

var Position = document.getElementById("Position")
Position.addEventListener('click', position)

var Creat_room = document.getElementById("Creat_room")
Creat_room.addEventListener('click', creat_room)

var cancel2 = document.getElementById("cancel2")
cancel2.addEventListener('click', Cancel2)

var Conect_room = document.getElementById("Conect_room")
Conect_room.addEventListener('click', conect_room)

var Log_rooming = document.getElementById("Log_rooming")
Log_rooming.addEventListener('click',log_rooming)

var Game_frend = document.getElementById("Game_frend")
Game_frend.addEventListener('click',game_frend)

var Log_out3 = document.getElementById("Log_out3") 
Log_out3.addEventListener('click',log_out3)

var Log_out4 = document.getElementById("Log_out4") 
Log_out4.addEventListener('click',log_out4)

var text2 = document.getElementById("text2")
var Crear_Con_Prem = document.getElementById("Crear_Con_Prem")
var bt_c_c_l = document.getElementById("bt_c_c_l")
var inp_ID = document.getElementById("inp_ID")
var Conect_block = document.getElementById("Conect_block")

var col_2 = document.getElementById("col_2")
var col__4 = document.getElementById("col__4")
var err_status = document.getElementById("err")
var ROOM = document.getElementById("ROOM")
var black = document.getElementById("black")
var Menu = document.getElementById("Block_button")
var Expec = document.getElementById("expec")
var Time = document.getElementById("time")
var User1 = document.getElementById("User1")
var User2 = document.getElementById("User2")
var expec_game = document.getElementById("expec_game")
var Move = document.getElementById("Move")
var end = document.getElementById("end")
var end2 = document.getElementById("end2")
var USER = document.getElementById("USER")
var mine_Menu = document.getElementById("mine_Menu")
var Menu_pos = document.getElementById("Block_button_net")
var exp_end = document.getElementById("exp_end")
var cancell_game =  document.getElementById("cancell")

var clientRoom//Комната.

function log_out4(){
    Conect_block.style.display="none"
    bt_c_c_l.style.display="block"
    text2.innerText=""

    ID_user = data_o_user.Data_session.Id
    socket.emit('No_revang',ID_user)
    end.style.display="none"
    cancell_game.style.display="none"
    black.style.display="block"
    Menu.style.display="block"
}

function log_out3(){
    Menu.style.display="block"
    Crear_Con_Prem.style.display="none"
}

function game_frend(){
    Menu.style.display="none"
    Crear_Con_Prem.style.display="block"
}

function log_rooming(){
    ID_room = inp_ID.value
    console.log(ID_room)
    socket.emit('Log_rooming_1', {
        ID_room:ID_room,
        ID_user:data_o_user.Data_session.Id,
        Nick:data_o_user.Data_session.Nick
    })
}

function conect_room(){
    Conect_block.style.display="block"
    bt_c_c_l.style.display="none"
    cancel2.style.display="block"
}

function creat_room(){
    ID_user = data_o_user.Data_session.Id
    socket.emit('Crear_Con_Prem', {
        ID_user:data_o_user.Data_session.Id,
        Nick:data_o_user.Data_session.Nick
    })
}

function Cancel2(){
    text2.innerText=""
    Conect_block.style.display="none"
    bt_c_c_l.style.display="block"
    cancel2.style.display="none"

    ID_user = data_o_user.Data_session.Id,
    socket.emit('cancel2', ID_user)
}

function position(){
    Delet_ship()
    Play.style.display="none"
    Position.innerText="Очистить"
    ID_user = data_o_user.Data_session.Id
    socket.emit('position',ID_user)
    if(key_position = true){
        key_position = false
        for(i=0;i<10;i++){
            for(j=0;j<10;j++){
                if(field_user==0){
                    document.getElementById(i+":"+j+":"+field_user).addEventListener('click',Can_pos)
                    document.getElementById(i+":"+j+":"+field_user).addEventListener('mouseover',Mous_hover_ov)
                    document.getElementById(i+":"+j+":"+field_user).addEventListener('mouseout',Mous_hover_ou)
                    document.getElementById(i+":"+j+":"+field_user).addEventListener('contextmenu', Change_position)
                }else{
                    document.getElementById(i+":"+j+":"+field_user).addEventListener('click',Can_pos)
                    document.getElementById(i+":"+j+":"+field_user).addEventListener('mouseover',Mous_hover_ov)
                    document.getElementById(i+":"+j+":"+field_user).addEventListener('mouseout',Mous_hover_ou)
                    document.getElementById(i+":"+j+":"+field_user).addEventListener('contextmenu', Change_position)
                }
            }
        }
    } 
}

function Can_pos(event){//На сервер.
    console.log("ЛКМ")
    coord_xy_p = event.srcElement.id.split(":")
    socket.emit('Can_pos',{coord_xy_p:coord_xy_p, ID_user:data_o_user.Data_session.Id})
}
function Mous_hover_ov(event){//На сервер
    coord_xy_p = event.srcElement.id.split(":")
    socket.emit('mouseover',{coord_xy_p:coord_xy_p, ID_user:data_o_user.Data_session.Id})
    //,field_user:field_user
}

function Change_position(event){//На сервер
    event.preventDefault();
    console.log("ПКМ")
    coord_xy_p = event.srcElement.id.split(":")
    Change_position_del(coord_xy_p)
    ID_user = data_o_user.Data_session.Id
    socket.emit('Change_position',ID_user)
    socket.emit('mouseover',{coord_xy_p:coord_xy_p, ID_user:data_o_user.Data_session.Id})
}

function Mous_hover_ou(event){//Клиент
    coord_x_y = event.srcElement.id.split(":")
    x1 = Number(coord_x_y[0])
    y1 = Number(coord_x_y[1])
    p1 = Number(coord_x_y[2])
    a_x = x1+1
    a_y = y1+1
    for(g=x1;g<10;g++){
        for(h=y1;h<10;h++){
            att_id = document.getElementById(g+":"+h+":"+p1)
            if(att_id.classList.contains("Hover_on")){
                att_id.classList.remove("Hover_on")
            }
            if(att_id.classList.contains("Hover_on_red")){
                att_id.classList.remove("Hover_on_red")
            }
        }
    }
}

function Change_position_del(coord_x_y){
    x1 = Number(coord_x_y[0])
    y1 = Number(coord_x_y[1])
    p1 = Number(coord_x_y[2])
    a_x = x1+1
    a_y = y1+1
    for(g=x1;g<10;g++){
        for(h=y1;h<10;h++){
            att_id = document.getElementById(g+":"+h+":"+p1)
            if(att_id.classList.contains("Hover_on")){
                att_id.classList.remove("Hover_on")
            }
            if(att_id.classList.contains("Hover_on_red")){
                att_id.classList.remove("Hover_on_red")
            }
        }
    }
}

function log_out(){
    Conect_block.style.display="none"
    bt_c_c_l.style.display="block"
    text2.innerText=""

    ID_user = data_o_user.Data_session.Id
    socket.emit('No_revang',ID_user)
    end.style.display="none"
    cancell_game.style.display="none"
    black.style.display="block"
    Menu.style.display="block"
}

function log_out2(){
    Conect_block.style.display="none"
    bt_c_c_l.style.display="block"
    text2.innerText=""

    ID_user = data_o_user.Data_session.Id
    socket.emit('No_revang',ID_user)
    end.style.display="none"
    cancell_game.style.display="none"
    black.style.display="block"
    Menu.style.display="block"
}

function Delet_class(){
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
}
function Delet_ship(){
    for(i=0;i<10;i++){
        for(j=0;j<10;j++){
            //Очищаем массив и поле.
            cletka = document.getElementById(i+":"+j+":"+field_user)
            if(cletka.classList.contains("Ship_shadow")){
                cletka.classList.remove("Ship_shadow") //Удаляем палубу на поле.
            }
        }
    }
}

function Delet_handler_pos(){
    for(i=0;i<10;i++){
        for(j=0;j<10;j++){
            if(field_user==0){
                document.getElementById(i+":"+j+":"+field_user).removeEventListener('click',Can_pos)
                document.getElementById(i+":"+j+":"+field_user).removeEventListener('mouseover',Mous_hover_ov)
                document.getElementById(i+":"+j+":"+field_user).removeEventListener('mouseout',Mous_hover_ou)
                document.getElementById(i+":"+j+":"+field_user).removeEventListener('contextmenu', Change_position)
            }else{
                document.getElementById(i+":"+j+":"+field_user).removeEventListener('click',Can_pos)
                document.getElementById(i+":"+j+":"+field_user).removeEventListener('mouseover',Mous_hover_ov)
                document.getElementById(i+":"+j+":"+field_user).removeEventListener('mouseout',Mous_hover_ou)
                document.getElementById(i+":"+j+":"+field_user).removeEventListener('contextmenu', Change_position)
            }
        }
    }
}


function new_game(){
    bt_c_c_l.style.display="block"
    text2.innerText=""

    end.style.display="none"
    cancell_game.style.display="none"
    ID_user = data_o_user.Data_session.Id
    socket.emit('Log_out_Room',ID_user)
    Cre_Con_room()
}
function new_game2(){
    end.style.display="none"
    cancell_game.style.display="none"
    ID_user = data_o_user.Data_session.Id
    socket.emit('Log_out_Room',ID_user)
    Cre_Con_room()
}

function Open_set(){
    console.log("Настройки")
}

function Give_up(){
    black.style.display="block"
    exp_end.style.display="block"
}

function Yes(){
    black.style.display="none"
    exp_end.style.display="none"
    set.style.display="none"
    give_up.style.display="none"

    ID_user = data_o_user.Data_session.Id
    socket.emit('Give_up',ID_user)
}

function No(){
    black.style.display="none"
    exp_end.style.display="none"
    set.style.display="none"
    give_up.style.display="none"
}

function Open_menu(){
    set.style.display="block"
    give_up.style.display="block"
}

function revenge(){
    if(revenge_user==true){
        console.log("Хочу реванш")
        revenge_user=false
        ID_user = data_o_user.Data_session.Id
        console.log(ID_user)
        socket.emit('Revenge',ID_user)
    }
}

function revenge4(){
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
    if(key_position==false){
        Position.innerText="Вручную"
        key_position=true
        Delet_handler_pos()
    }
    Delet_ship()
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
    Play.style.display="none"
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
