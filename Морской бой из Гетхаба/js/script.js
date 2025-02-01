//Создаём поле на Конве.
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const mouse = getMouse(canvas); // Получение координат мыши.
const game = new Game;
const FIELD_SIZE = 30;
const CELL_SIZE = 30;
let developer = false;
let isSafeShips = false;
let isPlayerReady = true;
let falseOrderCamp = false;
let falseOrder = false;
let forRnd = false;
let vol = 100;
let rnd = 0;
let s = 0;

//Размер конвы.
canvas.width = 1055;
canvas.height = 450;

function clearCanvas() {
	canvas.width |= 0;
}

//Создание сетки.
function drawGrid() {
	context.strokeStyle = '#2B5E97';//менее чётные клетки на фоне.
	context.lineWidth = 0.5;
	for (let i=0; i<canvas.width/CELL_SIZE; i++) { //горезонтальные линии
		context.beginPath();
		context.moveTo(i * CELL_SIZE+2, 0);
		context.lineTo(i * CELL_SIZE+2, canvas.height);
		context.stroke();
	}
	for (let i=0; i<canvas.height/CELL_SIZE; i++) { //вертекальные линии
		context.beginPath();
		context.moveTo(0, i * CELL_SIZE-2);
		context.lineTo(canvas.width, i * CELL_SIZE-2);
		context.stroke();
	}

	//Карная линия.
	context.strokeStyle = '#C2948D'; // Цвет линии.
	context.lineWidth = 3; //Толщина линии

	context.beginPath();
	context.moveTo(0, 82); //Первая точка отрезка
	context.lineTo(canvas.width, 82); //Конечная точка отрезка.
	context.stroke(); //Нужна, чтобы нарисовать.
}

function gameTimer() {
	s++;
	let msec = Math.floor(s/60);

	//Часы.
	sec = Math.floor(msec % 60);
	min = Math.floor(msec % 3600/60);
	hrs = Math.floor(Math.floor(msec % 360000/60)/60);

	if (hrs<10) {
		refreshText('hrs','0'+hrs);
	} else {refreshText('hrs',hrs);}

	if (min<10) {
		refreshText('min','0'+min);
	} else {refreshText('min',min);}

	if (sec<10) {
		refreshText('sec','0'+sec);
	} else {refreshText('sec',sec);}
}

//получение рандомной точки из массива array
//Выстрел компьютера.
function getRandomFrom(array) {
	const index = Math.floor(Math.random() * array.length);
	return array[index];
}

function refreshText(id,text) {
	document.getElementById(id).textContent = text;
}

function addClsActive(id) {
	document.getElementById(id).classList.add('active');
}
function rmvClsActive(id) {
	document.getElementById(id).classList.remove('active');
}
function tglClsActive(id) {
	document.getElementById(id).classList.toggle('active');
}

function gameConsoleLog(name,point,event) {
	document.getElementById('steps').insertAdjacentHTML('afterbegin',
		`<p id="steps-item"><span>#`+game.n+` </span><span class="who"> `+name+` </span><span>: </span><span class="where">`+game.alphabet[point.x]+`-`+(point.y+1)+`</span><span> </span><span class="what">`+event+`</span></p>`
	);
	game.n++;
}

//Нужна для того, чтобы можно был запустить ещё раз игру после победы или поражения.
function clrConsole() {
	refreshText('steps','');
	game.n = 1;
}

//Воспроизвести звук.
function playSound(id) {
	if (!isSound) {return}
	let levels = document.querySelectorAll('[id^='+id+']');
	let n = Math.floor(Math.random() * levels.length);
	levels[n].volume=vol/100;
	levels[n].pause();
	levels[n].currentTime = 0;
	levels[n].play();
}

function newGame() {
	game.player.deadShips =[];
	game.camp.hideShip = true;
	clrConsole();
	s = 0;
	game.player = new Topology({
		name: game.player.name,
		offsetX: game.player.offsetX,
		offsetY: game.player.offsetY,
		win: game.player.win,
		ships: game.player.ships,
	});
	for (let ship of game.player.ships) {
		ship.live = ship.size
	}
	if (!isSafeShips) {game.player.randoming()}
	game.camp = new Topology({
		name: game.camp.name,
		offsetX: game.camp.offsetX,
		offsetY: game.camp.offsetY,
		hideShip: game.camp.hideShip,
		level: game.camp.level,
		win: game.camp.win,
	});
	game.camp.randoming();
}