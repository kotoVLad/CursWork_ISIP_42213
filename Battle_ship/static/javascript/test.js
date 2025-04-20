let field_user=null
let data_o_user
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
    
        socket.on('CanClick',()=>{
            key_click = true
            user_triger = true
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
            console.log("Всё окей, оба пользователя присоеденилось.")
            Expec.style.display="none"
            black.style.display="none"
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
            expec_game.style.display="none"
            black.style.display="none"
            for(i=0;i<10;i++){
                for(j=0;j<10;j++){
                    if(field_user==0){
                        a_click=1
                        // document.getElementById(i+":"+j+":"+a_click).addEventListener('click',Click)
                        // document.getElementById(i+":"+j+":"+a_click).addEventListener('mouseover',Mous_hover_on)
                        // document.getElementById(i+":"+j+":"+a_click).addEventListener('mouseout',Mous_hover_off)
                    }else{
                        b_click=0
                        // document.getElementById(i+":"+j+":"+b_click).addEventListener('click',Click)
                        // document.getElementById(i+":"+j+":"+b_click).addEventListener('mouseover',Mous_hover_on)
                        // document.getElementById(i+":"+j+":"+b_click).addEventListener('mouseout',Mous_hover_off)
                    }
                }
            }
        })
    }
}
/*for(i=0;i<10;i++){
    for(j=0;j<10;j++){

    }
} */


window.addEventListener('DOMContentLoaded', take_session);
console.log("test open")
let key_click = false
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


var black = document.getElementById("black")
var Menu = document.getElementById("Block_button")
var Expec = document.getElementById("expec")
var Time = document.getElementById("time")
var User1 = document.getElementById("User1")
var User2 = document.getElementById("User2")
var expec_game = document.getElementById("expec_game")

var Menu_pos = document.getElementById("Block_button_net")

var clientRoom//Комната.

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
