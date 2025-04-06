socket = io();
console.log("test open")
let key_click = false
//let socket=null

var Button = document.getElementById("clicking")
var label = document.getElementById("label")
Button.addEventListener("click", conn)

let clientRoom;
socket.on('serverMsg',(data)=>{
    console.log(`Я в комнате${data}`)
    clientRoom = data;
    socket.emit('initing', clientRoom)
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

function conn(){
    console.log("Button")
    if(key_click==true){
        socket.emit('ButtonClick',clientRoom)
    }
}
