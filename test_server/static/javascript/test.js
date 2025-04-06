console.log("test open")
let key_click = false
let socket=null
let activityInterval;

var Button = document.getElementById("clicking")
var Button2 = document.getElementById("Ck")
var label = document.getElementById("label")
const statusElement = document.getElementById('status');

Button.addEventListener("click", conn)
Button2.addEventListener("click", conne)

const sendActivity = () => {
    if (socket && socket.connected) {
        socket.emit('activity');
    }
};

// Установка интервала активности (каждые 10 секунд)
const setupActivityMonitor = () => {
    activityInterval = setInterval(sendActivity, 10000);
};

// Очистка интервала
const clearActivityMonitor = () => {
    if (activityInterval) {
        clearInterval(activityInterval);
        activityInterval = null;
    }
};



let clientRoom;
function conne(){
    if(!socket){
        socket = io({
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000
        });
        Button2.textContent = 'Отключиться';
        statusElement.textContent = 'Статус: Подключение...';
        statusElement.className = 'status';
        socket.on('connect', () => {
            console.log('Connected to server');
            statusElement.textContent = 'Статус: Подключен';
            statusElement.className = 'status connected';
            setupActivityMonitor();
        });

        socket.on('connection_status', (data) => {
            if (data.status === 'reconnecting') {
                statusElement.textContent = 'Статус: Переподключение...';
                statusElement.className = 'status';
            }
        });

        socket.on('disconnect', (reason) => {
            console.log(`Disconnected: ${reason}`);
            statusElement.textContent = `Статус: ${reason === 'io server disconnect' ? 'Отключён' : 'Ожидание переподключения...'}`;
            statusElement.className = 'status disconnected';
            clearActivityMonitor();
            
            if (reason === 'io server disconnect') {
                socket = null;
                connectBtn.textContent = 'Подключиться';
            }
        });
    

        //--------------------------------------
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
    }else {
        // Закрываем существующее подключение
        socket.disconnect();
        socket = null;
        clearActivityMonitor();
        
        // Обновляем UI
        Button2.textContent = 'Подключиться';
        statusElement.textContent = 'Статус: Не подключен';
        statusElement.className = 'status';
    }
    
}


function conn(){
    console.log("Button")
    if(key_click==true){
        socket.emit('ButtonClick',clientRoom)
    }
}
