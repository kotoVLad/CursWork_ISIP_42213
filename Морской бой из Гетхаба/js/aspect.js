/////////////////////////////////////////////////////////
//для разработчика
document.getElementById('developer').addEventListener('click', function(event) {
	tglClsActive('dev-block');
	playSound('sound-click');
});

document.getElementById('dev-btn').addEventListener('click', function(event) {
	tglClsActive('dev-btn');
	developer = !developer;
	playSound('sound-click');
});

document.getElementById('order-btn').addEventListener('click', function(event) {
	tglClsActive('order-btn');
	falseOrder = !falseOrder;
	playSound('sound-click');
});

document.getElementById('order-btn-camp').addEventListener('click', function(event) {
	tglClsActive('order-btn-camp');
	falseOrderCamp = !falseOrderCamp;
	playSound('sound-click');
});

document.getElementById('hide-ships').addEventListener('click', function(event) {
	tglClsActive('hide-ships');
	game.camp.hideShip = !game.camp.hideShip;
	playSound('sound-click');
});
///////////////////////////////////////////////

document.getElementById('speedy').addEventListener('click', function(event) {
	tglClsActive('speedy');
	forRnd = !forRnd;
	playSound('sound-click');
});

document.getElementById('safeShips').addEventListener('click', function(event) {
	tglClsActive('safeShips');
	isSafeShips = !isSafeShips;
	playSound('sound-click');
});

document.getElementById('btn_random').addEventListener('click', function(event) {
	game.player.randoming();
	isPlayerReady = true;
	playSound('sound-click');
});

document.getElementById('btn_self').addEventListener('click', function(event) {
	clearCanvas();
	game.player.ships = [];
	isPlayerReady = false;
	playSound('sound-click');
});

document.getElementById('btn_play').addEventListener('click', function(event) {
	if(!isPlayerReady) {return}
	game.stage = 'play';
	playSound('sound-click');
});

let isSound = true;
document.getElementById('not-sound').addEventListener('click', function(event) {
	tglClsActive('not-sound');
	isSound = !isSound;
	playSound('sound-click');
});


let levels = document.querySelectorAll('[id^="levelButton"]');
[].forEach.call(levels, function(elem){
	elem.addEventListener('click',function(){
		if (elem.id.replace(/[^\d]/g, '') == "" || this.classList.contains('active')) {return}
		game.camp.level = Number(elem.id.replace(/[^\d]/g, ''));
		for (let item of levels) {
			item.classList.remove('active');
		}
		tglClsActive(elem.id);
		playSound('sound-click');
	})
})

document.getElementById('vol-plus').addEventListener('click', function(event) {
	if (vol===100) {return;}
	vol = vol + 10;
	playSound('sound-click');
	document.getElementById('volume').value = vol;
});
document.getElementById('vol-minus').addEventListener('click', function(event) {
	if (vol===0) {return;}
	vol = vol - 10;
	playSound('sound-click');
	document.getElementById('volume').value = vol;
});

document.getElementById('btn-skip').addEventListener('click', function(event) {
	rmvClsActive('input-block');
	addClsActive('rename');
	playSound('sound-click');
});

document.getElementById('btn-ok').addEventListener('click', function(event) {
	let playerName = document.getElementById('namePlayer').value;
	if (playerName !== '') {
		game.player.name = playerName;
	}
	let campName = document.getElementById('nameCamp').value;
	if (campName !== '') {
		game.camp.name = campName;
	}
	rmvClsActive('input-block');
	addClsActive('rename');
	refreshText('mainNamePlayer',game.player.name);
	refreshText('mainNameCamp',game.camp.name);
	playSound('sound-click');
});

document.getElementById('rename').addEventListener('click', function(event) {
	rmvClsActive('rename');
	playSound('sound-click');
	rmvClsActive('btn-skip');
	rmvClsActive('input-text');
	addClsActive('input-block');
	refreshText('btn-ok','Применить');
});

document.getElementById('btn-replay').addEventListener('click', function(event) {
	playSound('sound-click');
	game.stage = 'play';
	rmvClsActive('gameOver');
	addClsActive('btn-block');
	newGame();
});

document.getElementById('btn-main').addEventListener('click', function(event) {
	refreshText('order','Расставь свои корабли');
	refreshText('level-text','Выбери уровень сложности компьютера');
	refreshText('game_status','Подготовка к бою');
	game.stage = 'preparation';
	addClsActive('btn-block');
	playSound('sound-click');
	rmvClsActive('gameOver');
	addClsActive('order');
	gameTimer();
	newGame();
});