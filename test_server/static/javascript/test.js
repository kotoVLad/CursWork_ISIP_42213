console.log("test open")
let key_click = false
let socket=null
let activityInterval;

var Button = document.getElementById("clicking")
var Button2 = document.getElementById("Ck")
var Button3 = document.getElementById("Conect_room")

var label = document.getElementById("label")

const User1_status = document.getElementById('status');//Мой статус
const User2_status = document.getElementById('status2');//Статус второго человека

const mark_status1 = document.getElementById('stat');
const mark_status2 = document.getElementById('stat2');


Button.addEventListener("click", conn)//Кнопка кликать.
Button2.addEventListener("click", conne)//Кнопка для подключение к серверу.
Button3.addEventListener("click", cre_con_room)//Создать/Подклються к комнате.

var Nick = document.getElementById("Name")//Ник пользователя.
var ID_user = document.getElementById("id_user")//Id пользователя.

let clientRoom;//Название комнаты
function conne(){
    if(!socket){
        socket = io();
        Button2.textContent = 'Отключиться';

        mark_status1.textContent = 'подключен' 
        mark_status1.classList.remove("red")
        mark_status1.classList.remove("add")

        //--------------------------------------
        socket.on('serverMsg',(data)=>{
            console.log(`Я в комнате${data}`)
            clientRoom = data;
        })
        socket.on('CanClick',()=>{
            key_click = true
            label.innerText="Можно кликать"
            mark_status2.textContent = 'подключен' 
            
            mark_status2.classList.remove("red")
            mark_status2.classList.remove("add")
            
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
    }else {
        // Закрываем существующее подключение
        socket.disconnect();
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
    Button3.textContent = "Отключиться от комнаты"
    Nick = Nick.value;
    ID_user = ID_user.value;
    socket.emit('cre_con_room',{Nick:Nick, ID_user:ID_user})
}