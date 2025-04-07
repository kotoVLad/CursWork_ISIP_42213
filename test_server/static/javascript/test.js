console.log("test open")
let key_click = false
let socket=null
let activityInterval;

var Button = document.getElementById("clicking")
var Button2 = document.getElementById("Ck")
var label = document.getElementById("label")

const User1_status = document.getElementById('status');//Мой статус
const User2_status = document.getElementById('status2');//Статус второго человека

const mark_status1 = document.getElementById('stat');
const mark_status2 = document.getElementById('stat');


Button.addEventListener("click", conn)
Button2.addEventListener("click", conne)

var Nick = document.getElementById("Name")//Ник пользователя.
var ID_user = document.getElementById("id_user")//Id пользователя.

let clientRoom;//Название комнаты
function conne(){
    if(!socket){
        socket = io();
        Button2.textContent = 'Отключиться';

        User1_status.textContent = 'Ваш статус: подключен' 
        mark_status1.classList.remove("red")
        mark_status1.classList.remove("add")

        Nick = Nick.value;
        ID_user = ID_user.value;

        //--------------------------------------
        socket.on('serverMsg',(data)=>{
            console.log(`Я в комнате${data}`)
            clientRoom = data;
        })
        socket.on('CanClick',()=>{
            key_click = true
            label.innerText="Можно кликать"
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
