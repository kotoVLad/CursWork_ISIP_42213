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
            console.log("Всё окей, оба пользователя присоеденилось.")
        })
        socket.on('User2_discon', (User2_dis)=>{
            
        })
    }
}

window.addEventListener('DOMContentLoaded', take_session);
console.log("test open")
let key_click = false
let socket=null
let activityInterval;

var Button = document.getElementById("Fast_game")
Button.addEventListener('click',Cre_Con_room);
var Button2 = document.getElementById("Game_frend")
var Button3 = document.getElementById("See")

var clientRoom//Комната.

function Cre_Con_room(){
    socket.emit('cre_con_room',{
        Nick: data_o_user.Data_session.Nick,
        ID_user: data_o_user.Data_session.Id
    })
}