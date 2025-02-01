class Game {
	constructor() {
		this.alphabet = ['А','Б','В','Г','Д','Е','Ж','З','И','К'],
		this.isChackedPoint = false,
		this.stage = 'preparation',
		this.isPlayerOrder = true,
		this.hitStatus = 'мимо',
		this.isTimeout = true,
		this.isHit = false,
		this.n = 1,

		this.player = new Topology({
			name: 'Player',
			offsetX: 32,
			offsetY: 88,
		});

		this.camp = new Topology({
			name: 'Camp',
			offsetX: 692,
			offsetY: 88,
			hideShip: true,
			level: 3,
		});
		
		this.camp.randoming();
		this.player.randoming();

		requestAnimationFrame(x => this.tick(x));
	}

	tick(timestamp) {
		requestAnimationFrame(x => this.tick(x));
		clearCanvas();
		drawGrid();
		this.player.draw(context);
		this.camp.draw(context);
		if (this.stage === 'preparation') {
			this.tickPreparation(timestamp);
		}

		if (this.stage === 'play') {
			gameTimer();
			this.player.getCheckenFields();
			this.player.getUnknownFields();
			addClsActive('order');
			addClsActive('steps');
			this.tickPlay(timestamp);
			rmvClsActive('btn-block');
			rmvClsActive('level-block');
			refreshText('game_status','Игра началась!');
			refreshText('level-text','Уровень сложности: '+this.camp.level);
			if (this.camp.isGameOver()) {
				playSound('sound-win');
				refreshText('winner','Победил '+this.player.name+', поздравляем!');
				this.player.win++;
				refreshText('winPlayer',this.player.win);
			}
			else if (this.player.isGameOver()) {
				playSound('sound-fail');
				refreshText('winner','Победил '+this.camp.name+', попробуй еще раз.');
				this.camp.win++;
				refreshText('winCamp',this.camp.win);
			}
			if (this.stage === 'gameOver') {
				game.camp.hideShip = false;
				refreshText('level-text','Ты можешь сменить уровень сложности:');
				refreshText('game_status','Game Over!');
				addClsActive('level-block');
				addClsActive('gameOver');
				rmvClsActive('order');
				rmvClsActive('steps');
			}
		}
		this.isTimeout = true;
		mouse.click = false;
	}

	tickPreparation(timestamp) {
		if (!this.player.isPointUnder(mouse)) {return}
		const shipSizes = [4,3,3,2,2,2,1,1,1,1];
		const shipSize = shipSizes[this.player.ships.length];
		const coordinate = this.player.getCoordinats(mouse);

		const ship = {
			x: coordinate.x,
			y: coordinate.y,
			direct: mouse.scroll ? 1 : 0,
			size: shipSize,
			live: shipSize,
		}
		
		if (!this.player.canStay(ship)) {

			if(ship.direct === 0) {
				if (ship.x+ship.size > 10) {ship.x = ship.x - (ship.size + coordinate.x - 10);}
			}
			if(ship.direct === 1) {
				if (ship.y+ship.size > 10) {ship.y = ship.y - (ship.size + coordinate.y - 10);}
			}
		}

		if (this.player.ships.length === 0) {
			refreshText('btn_self','Расставить вручную');
		}
		
		if (this.player.ships.length === 1) {
			refreshText('btn_self','Очистить поле');
		}
		if (this.player.ships.length === 10) {
			isPlayerReady = true;
			return;
		}
		
		this.player.drawShips(context, ship);
		if (!this.player.canStay(ship)) {
			this.player.drawDeadShips(context, ship);
		}
		if (mouse.click) {
			if (this.player.canStay(ship)) {
				playSound('sound-click');
				this.player.addShips(ship);
			}
		}
	}

	tickPlay(timestamp) {
		if (this.isPlayerOrder) {
			refreshText('order','твой ход');
			if (!this.camp.isPointUnder(mouse)) {
				return}
			const point = this.camp.getCoordinats(mouse);
			this.camp.addHoverPoint(point);
			if (mouse.click) {
				this.camp.addChecks(point);
				if (this.isCheckedPoint) {
					this.camp.update();
					gameConsoleLog(this.player.name,point,this.hitStatus);
					this.hitStatus = 'мимо';
					if (!this.camp.isShipUnderpoint(point)) {
						playSound('sound-shot');
						if (falseOrder) {return}
						this.isPlayerOrder = false;
					}
				}
			}
		} else {
			if (this.camp.level === 5) {this.player.itIsChit()};
			refreshText('order','Ход компьютера');
			setTimeout( function() {game.isTimeout = false;},rnd);
			if (this.isTimeout || this.stop === 0) {return};
			let point = 0;
			this.stop = 0;

			if (this.camp.level === 1) {point = getRandomFrom(this.player.getUnknownFields());}
			if (this.camp.level !== 1) {
				
				if (this.player.getCheckenFields().length === 0) {this.isHit = false;}
				if (this.isHit) {point = getRandomFrom(this.player.getCheckenFields());}
				else {point = getRandomFrom(this.player.getUnknownFields());}
				if (this.player.isShipUnderpoint(point)) {this.isHit = true;}
			}
			this.player.addChecks(point);
			this.player.update();
			gameConsoleLog(this.camp.name,point,this.hitStatus);
			this.hitStatus = 'мимо';
			if (!this.player.isShipUnderpoint(point)) {
				this.stop = 1;
				playSound('sound-shot');
				if (falseOrderCamp) {return}
				this.isPlayerOrder = true;
			}
		}
	}
}
