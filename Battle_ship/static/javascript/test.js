console.log("test open")
let key_click = false
let socket=null
let activityInterval;

var Button = document.getElementById("clicking")
var Button2 = document.getElementById("Ck")
var Button3 = document.getElementById("Conect_room")
var Button4 = document.getElementById("leave_room")

var Button_save = document.getElementById("Save")

var label = document.getElementById("label")

const User1_status = document.getElementById('status');//Мой статус
const User2_status = document.getElementById('status2');//Статус второго человека

const User2 = document.getElementById('user2')

const mark_status1 = document.getElementById('stat');
const mark_status2 = document.getElementById('stat2');


Button.addEventListener("click", conn)//Кнопка кликать.
Button2.addEventListener("click", conne)//Кнопка для подключение к серверу.
Button3.addEventListener("click", cre_con_room)//Создать/Подклються к комнате.
Button4.addEventListener("click", leave)
Button_save.addEventListener("click",Saveing)

var Nick = document.getElementById("Name")//Ник пользователя.
var ID_user = document.getElementById("id_user")//Id пользователя.
var Nick_user=null
var ID_User=null
var user_triger = null//null - 2 пользователь не заходил, true - Зашёл, end - пользователь покинул.
let clientRoom=0;//Название комнаты
function conne(){
    if(!socket){
        socket = io();
        Button2.textContent = 'Отключиться';
        socket.emit('Id_identified',ID_User)
        mark_status1.textContent = 'подключен' 
        mark_status1.classList.remove("red")
        mark_status1.classList.remove("add")

        //--------------------------------------
        socket.on('serverMsg',(data)=>{
            console.log(`Я в комнате${data}`)
            clientRoom = data;
        })

        socket.on('Cann_us',(data)=>{
            User2.textContent = data
        })

        socket.on('CanClick',()=>{
            key_click = true
            user_triger = true
            label.innerText="Можно кликать"
            mark_status2.textContent = 'подключен' 
            
            mark_status2.classList.remove("red")
            mark_status2.classList.add("can")
            
            label.classList.remove("red")
            label.classList.add("can")
        })
        
        socket.on('EventServer', ()=>{//Отобразить цвет на клиете, а также у драгого клиента.
            if(Button.classList.contains("colr")){
                Button.classList.remove("colr")
            }else{
                Button.classList.add("colr")
            }
        })

        socket.on('User2_discon', (User2_dis)=>{
            mark_status2.textContent="Отключился."
            mark_status2.classList.remove("can")
            mark_status2.classList.add("red")
            user_triger="end"
        })
    }else {
        // Закрываем существующее подключение
        socket.disconnect(clientRoom);
        socket = null;
        // Обновляем UI
        Button2.textContent = 'Подключиться';
    }
    
}

function conn(){
    if(key_click==true){
        socket.emit('ButtonClick',clientRoom)
    }
}

function cre_con_room(){
    socket.emit('cre_con_room',{Nick:Nick_user, ID_user:ID_User})
}

function leave(){
    if(clientRoom!=0){
        User2.textContent = "Чужой"
        mark_status2.textContent="Отключился."
        mark_status2.classList.remove("can")
        mark_status2.classList.add("red")

        socket.emit('leave_room',{clientRoom:clientRoom,user_triger:user_triger,Nick:Nick_user})

        clientRoom=0
        if(user_triger=="end"||user_triger==true){
            user_triger=null
        }
    }
    
}

function Saveing(){
    Nick_user = Nick.value;
    ID_User = ID_user.value;
    console.log(Nick_user,ID_User)
}
