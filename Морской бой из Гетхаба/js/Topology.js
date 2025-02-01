class Topology {
	constructor(param) {
		this.name = param.name;
		this.level = param.level;
		this.win = param.win || 0;
		this.offsetX = param.offsetX;
		this.offsetY = param.offsetY;
		this.hideShip = param.hideShip || false;

		this.ships = param.ships || [];
		this.hover = [];
		this.checks = [];
		this.isChecks = [];
		this.injuries = [];
		this.deadShips = [];
		this.number = 0;
		//для разработчика
		this.isChecksF = [];
		this.isChecksF2 = [];
		//==============
	}

	//добавление обьектов в массив
	addShips(...ships) {
		for(const ship of ships) {
			if (!this.ships.includes(ship)) {
				this.ships.push(ship);
			}
		}
		return this
	}

	//добавление обьектов в массив (убитые корабли)
	addDeadShips(...ships) {
		for(const ship of ships) {
			if (!this.deadShips.includes(ship)) {
				this.deadShips.push(ship);
			}
		}
		return this
	}

	//добавление обьектов в массив (проверенные точки на поле)
	addChecks(...checks) {
		if (game.isPlayerOrder) {
			const coordinate = this.getCoordinats(mouse);
			for (const unk of this.getUnknownFields()) {
				if (unk.x === coordinate.x && unk.y === coordinate.y) {
					game.isCheckedPoint = true;
					for(const check of checks) {
						if (!this.checks.includes(check)) {
							this.checks.push(check);
						}
					}
				}
			}
		}
		else {
			game.isCheckedPoint = false;
			for(const check of checks) {
				if (!this.checks.includes(check)) {
					if (check.x<=9 && check.y<=9 && check.x>=0 && check.y>=0) {
						this.checks.push(check);
					}
				}
			}
		}
		return this;
	}

	//добавление обьектов в массив (точки вокруг подбитого корабля, куда компьютеру не надо стрелять. Точки добавляются в removeCheckenField())
	addIsChecks(...isChecks) {
		if (!game.isPlayerOrder) {
			for(const isCheck of isChecks) {
				if (!this.isChecks.includes(isCheck)) {
					this.isChecks.push(isCheck);
				}
			}
		}
	}

	//для разработчика дублирование точек для отрисовки
	addIsChecksF(...isChecksF) {
		for(const isCheckF of isChecksF) {
			if (!this.isChecksF.includes(isCheckF)) {
				this.isChecksF.push(isCheckF);
			}
		}
	}
	addIsChecksF2(...isChecksF2) {
		for(const isCheckF2 of isChecksF2) {
			if (!this.isChecksF2.includes(isCheckF2)) {
				this.isChecksF2.push(isCheckF2);
			}
		}
	}
	//=============

	draw(context) {
		if (!this.hideShip) {
			for (const ship of this.ships) {
			this.drawShips(context, ship);
			}
		}
		for (const ship of this.deadShips) {
			this.drawDeadShips(context, ship);
		}
		for (const check of this.checks) {
			this.drawChecks(context, check);
		}
		for (const point of this.hover) {
			this.drawHover(context, point);
		}
		// для разработчика
		for (const isCheckF of this.isChecksF) {
			this.drawIsChecksF(context, isCheckF);
		}
		for (const isCheckF2 of this.isChecksF2) {
			this.drawIsChecksF2(context, isCheckF2);
		}
		//======
		for (const injury of this.injuries) {
			this.drawInjuries(context, injury);
		}
		this.drawFields(context);
		return this;
	}

	//отрисовка сетки самих полей игры.
	drawFields(context) {
		context.strokeStyle = '#2B5E97';
		context.lineWidth = 3;
		for (let i=1; i<12; i++) {
			context.beginPath();
			context.moveTo(
				this.offsetX + i * FIELD_SIZE,
				this.offsetY,
			);
			context.lineTo(
				this.offsetX + i * FIELD_SIZE,
				this.offsetY + 11 * FIELD_SIZE,
			);
			context.stroke();
		}
		for (let i=1; i<12; i++) {
			context.beginPath();
			context.moveTo(
				this.offsetX,
				this.offsetY + i * FIELD_SIZE,
			);
			context.lineTo(
				this.offsetX + 11 * FIELD_SIZE,
				this.offsetY + i * FIELD_SIZE,
			);
			context.stroke();
			context.fill();
		}

		context.fillStyle = '#2B5E97'
		context.textAlign = 'center';
		context.font = 'bold 18px Pangolin';
		const alphabet = 'АБВГДЕЖЗИК';
		//const alphabet = '0123456789';
		for (let i=0; i<10; i++) {
			const letter = alphabet[i];
			context.fillText(
				letter,
				this.offsetX + i * FIELD_SIZE + FIELD_SIZE*1.5,
				this.offsetY + FIELD_SIZE*.65,
			);
		}
		for (let i=1; i<11; i++) {
			context.fillText(
				i,
				this.offsetX + FIELD_SIZE*.45,
				this.offsetY+ i * FIELD_SIZE + FIELD_SIZE*0.7,
			);
		}
		return this;
	}

	//отрисовка попадания в корабль
	drawInjuries(context, injury) {
		context.strokeStyle = 'rgba(250,0,0,0.5)';
		context.lineWidth = 4;
		context.beginPath();
		context.moveTo(
			this.offsetX + injury.x * FIELD_SIZE+FIELD_SIZE+2,
			this.offsetY + injury.y * FIELD_SIZE+FIELD_SIZE+2,
		);
		context.lineTo(
			this.offsetX + injury.x * FIELD_SIZE+FIELD_SIZE*2-2,
			this.offsetY + injury.y * FIELD_SIZE+FIELD_SIZE*2-2,
		);
		context.moveTo(
			this.offsetX + injury.x * FIELD_SIZE+FIELD_SIZE+2,
			this.offsetY + injury.y * FIELD_SIZE+FIELD_SIZE*2-2,
		);
		context.lineTo(
			this.offsetX + injury.x * FIELD_SIZE+FIELD_SIZE*2-2,
			this.offsetY + injury.y * FIELD_SIZE+FIELD_SIZE+2,
		);
		context.stroke();
		return this;
	}

	//отриcовка hover
	drawHover(context, point) {
		context.fillStyle = 'rgba(48, 75, 116, 0.5)';
		context.beginPath();
		context.rect(
			this.offsetX + point.x * FIELD_SIZE+FIELD_SIZE,
			this.offsetY + point.y * FIELD_SIZE+FIELD_SIZE,
			FIELD_SIZE,
			FIELD_SIZE,
		);
		context.fill();
		return this;
	}

	//отрисова кораблей
	drawShips(context, ship) {
		context.fillStyle = 'rgba(68, 95, 126, 0.8)';
		context.beginPath();
		context.rect(
			this.offsetX + ship.x * FIELD_SIZE+FIELD_SIZE,
			this.offsetY + ship.y * FIELD_SIZE+FIELD_SIZE,
			(ship.direct === 0 ? ship.size : 1) * FIELD_SIZE,
			(ship.direct === 1 ? ship.size : 1) * FIELD_SIZE,
		);
		context.fill();
		return this;
	}

	//отрисовка убитых кораблей
	drawDeadShips(context, ship) {
		context.fillStyle = 'rgba(255, 100, 66, 0.5)';
		context.beginPath();
		context.rect(
			this.offsetX + ship.x * FIELD_SIZE+FIELD_SIZE,
			this.offsetY + ship.y * FIELD_SIZE+FIELD_SIZE,
			(ship.direct === 0 ? ship.size : 1) * FIELD_SIZE,
			(ship.direct === 1 ? ship.size : 1) * FIELD_SIZE,
		);
		context.fill();
		return this;
	}

	//отрисовка проверенных точек
	drawChecks(context, check) {
		context.fillStyle = 'rgba(251, 2, 3,0.4)';
		context.beginPath();
		context.arc(
			this.offsetX + check.x * FIELD_SIZE+FIELD_SIZE *1.5,
			this.offsetY + check.y * FIELD_SIZE+FIELD_SIZE *1.5,
			4,
			0,
			Math.PI * 2
		);
		context.fill();
		return this;
	}

	//для разработчика отрисовка возможных ходов
	drawIsChecksF(context, isCheck) {
		context.fillStyle = 'rgba(251, 2, 3,0.3)';
		context.beginPath();
		context.arc(
			this.offsetX + isCheck.x * FIELD_SIZE+FIELD_SIZE *1.5,
			this.offsetY + isCheck.y * FIELD_SIZE+FIELD_SIZE *1.5,
			8,
			0,
			Math.PI * 2
		);
		context.fill();
		return this;
	}
	//для разработчика отрисовка клеток для следующего хода кампьютера
	drawIsChecksF2(context, isCheck) {
		context.fillStyle = 'rgba(1, 252, 3,0.3)'
		context.beginPath();
		context.arc(
			this.offsetX + isCheck.x * FIELD_SIZE+FIELD_SIZE *1.5,
			this.offsetY + isCheck.y * FIELD_SIZE+FIELD_SIZE *1.5,
			8,
			0,
			Math.PI * 2
		);
		context.fill();
		return this;
	}
	//===========

	//проверяет, находится ли point над игровым полем
	isPointUnder(point) {
		if (
			point.x < this.offsetX + 4 + FIELD_SIZE ||
			point.x > this.offsetX + 4 + 11 * FIELD_SIZE ||
			point.y < this.offsetY + 4 + FIELD_SIZE ||
			point.y > this.offsetY + 4 + 11 * FIELD_SIZE
		) {
			return false;
		}
			return true;
	}

	addHoverPoint(point) {
		//добавление точки в массив для отрисовки,которая находится под мышкой, на вражеском поле
		this.hover = [point];
	}

	//получает,координаты point относительно игрового поля
	getCoordinats(point) {
		if(!this.isPointUnder(point)) {
			return false}
		const x = parseInt((point.x - this.offsetX - 5 - FIELD_SIZE)/FIELD_SIZE);
		const y = parseInt((point.y - this.offsetY - 6 - FIELD_SIZE)/FIELD_SIZE);
		return {
			x: Math.max(0, Math.min(9, x)),
			y: Math.max(0, Math.min(9, y)),
		}
	}

	//проверка возможности поставить корабль внутри игрового поля
	canStay(ship) {
		if (ship.direct === 0 && ship.x + ship.size > 10) {
			return false}
		if (ship.direct === 1 && ship.y + ship.size > 10) {
			return false}
		const map = [
			[true, true, true, true, true, true, true, true, true, true],
			[true, true, true, true, true, true, true, true, true, true],
			[true, true, true, true, true, true, true, true, true, true],
			[true, true, true, true, true, true, true, true, true, true],
			[true, true, true, true, true, true, true, true, true, true],
			[true, true, true, true, true, true, true, true, true, true],
			[true, true, true, true, true, true, true, true, true, true],
			[true, true, true, true, true, true, true, true, true, true],
			[true, true, true, true, true, true, true, true, true, true],
			[true, true, true, true, true, true, true, true, true, true]
		]
		for (const ship of this.ships) {
			if (ship.direct === 0) {
				for (let x=ship.x - 1; x<ship.x + ship.size + 1; x++) {
					for (let y=ship.y - 1; y<ship.y + 2; y++) {
						if (map[y] && map[y][x]) {
							map[y][x] = false;
						}
					}
				}
			}
			else {
				for (let x=ship.x - 1; x<ship.x + 2; x++) {
					for (let y=ship.y - 1; y<ship.y + ship.size + 1; y++) {
						if (map[y] && map[y][x]) {
							map[y][x] = false;
						}
					}
				}
			}
		}
		if (ship.direct === 0) {
			for (let i=0; i<ship.size; i++) {
				if (!map[ship.y][ship.x+i]) {
					return false;
				}
			}
		}
		else {
			for (let i=0; i<ship.size; i++) {
				if (!map[ship.y+i][ship.x]) {
					return false;
				}
			}
		}
		return true;
	}

	//рандмная расстановка кораблей
	randoming() {
		this.ships = [];
		for (let size=4; size>0; size--) {
			for (let n=0; n<5-size;n++) {
				let isStay = false;
				while (!isStay) {
					const ship = {
						x: Math.floor(Math.random()*10),
						y: Math.floor(Math.random()*10),
						direct: Math.random() > Math.random() ? 0 : 1,
						live: size,
						size,
					}
					if (this.canStay(ship)) {
						this.addShips(ship);
						isStay = true;
					}
				}
			}
		}
		return true;
	}

	//получает,карту кораблей на поле
	getShipsMap() {
		const map = [
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false]
		]
		for (const ship of this.ships) {
			if (ship.direct === 0) {
				for (let x=ship.x; x<ship.x + ship.size; x++) {
					if (map[ship.y] && !map[ship.y][x]) {
						map[ship.y][x] = true;
					}
				}
			}
			else {
				for (let y=ship.y; y<ship.y + ship.size; y++) {
					if (map[y] && !map[y][ship.x]) {
						map[y][ship.x] = true;
					}
				}
			}
		}
		return map;
	}

	//обработка попадания в корабль
	update() {
		const map = this.getShipsMap();
		if (this == game.player) {
			if (forRnd) {rnd = 100;}
			else {rnd = Math.round(Math.random() * (650 - 250) + 250);}
		}
		for (const check of this.checks) {
			if (map[check.y][check.x]) {
				this.injuries.push(check);
				const index = this.checks.indexOf(check);
				this.checks.splice(index, 1);
				game.isCheckedPoint = false;
				this.getShipInPoint(check.x,check.y);
				this.getCheckenFields();
			}
		}
	}

	//проверяет, находится ли корабль под точкой point
	isShipUnderpoint(point) {
		const map = this.getShipsMap();
		return map[point.y][point.x];
	}

	// функция убирает лишние точки из getCheckenFields после второго попадания в корабль
	removeCheckenField(ship) {
		//let x,y;
		for (var i=-1; i<2; i++) {
			if (i===0) {continue};
			if (ship.direct === 0) {
				for (let k=0; k<ship.size; k++) {
					this.addIsChecks({x:ship.x+k,y:ship.y+i});
				}
			}
			if (ship.direct === 1) {
				for (let k=0; k<ship.size; k++) {
					this.addIsChecks({x:ship.x+i,y:ship.y+k});
				}
			}
		}
	}

	//добавляет случайные 10 полей в начале раунда для компьютера 5 уровня сложности, куда камп стрелять не будет
	itIsChit() {
		if(this.number >= 10) {return}
		let point = getRandomFrom(this.getUnknownFields());
		this.isShipUnderpoint(point);
		if (this.isShipUnderpoint(point)) {return};
		this.addIsChecks(point);
		this.number++;
	}

	//получает точки вокруг подбитого коробля, чтобы камп следующим ходом стрелял вокруг ранненного
	getCheckenFields() {
		const roundChecked = [];
		if(developer) {this.isChecksF2 = roundChecked}
			else {this.isChecksF2 = []}
		for (let y=0; y<10; y++) {
			for (let x=0; x<10; x++) {
				for (const injury of this.injuries) {
					if (this == game.camp) {break}
					if (injury.x === x && injury.y === y) {
						for (let unk of this.getUnknownFields()) {
							for (let k=0; k<5; k++) {
								for(let l=-1; l<2; l++) {
									if (l===0){continue};
									if ((x+l) <= 9 && (x+l) >= 0 && y <= 9 && y >= 0) {
										if (unk.x === (x+l) && unk.y === y) {roundChecked.push({x:x+l,y:y});}
									}
									if (x <= 9 && x >= 0 && (y+l) <= 9 && (y+l) >= 0) {
										if (unk.x === x && unk.y === (y+l)) {roundChecked.push({x:x,y:y+l});}
									}
								}
								break;
							}
						}
					}
				}
			}
		}
		return roundChecked;
	}

	//получает неизвестные точки на игровом поле
	getUnknownFields() {
		const unknownFields = [];
		if(developer) {
			if (this == game.player) {this.isChecksF = unknownFields;}
		}
			else {this.isChecksF = []}
		for (let y=0; y<10; y++) {
			for (let x=0; x<10; x++) {
				let isChecked = false;
				for (const check of this.checks) {
					if (check.x === x && check.y === y) {
						isChecked = true;
						break;
					}
				}
				for (const isCheck of this.isChecks) {
					if (isCheck.x === x && isCheck.y === y) {
						isChecked = true;
						break;
					}
				}
				if (!isChecked) {
					for (const injury of this.injuries) {
						if (injury.x === x && injury.y === y) {
							isChecked = true;
							break;
						}
					}
				}
				if (!isChecked) {unknownFields.push({x,y})}
			}
		}
		return unknownFields;
	}

	//проверка победителя
	isGameOver() {
		const map = this.getShipsMap();
		for (const injury of this.injuries) {
			map[injury.y][injury.x] = false;
		}
		for (let status of map.flat()) {
			if (status) {
				return false;
			}
		}
		game.stage = 'gameOver';
		return true;
	}

	//получает точки вокруг убитого корабля
	getCheckAroundDeadShip(ship,x,y) {
		if (this == game.camp) {return}
		if (ship.direct === 0) {
			for (let x=ship.x - 1; x<ship.x + ship.size + 1; x++) {
				for (let y=ship.y - 1; y<ship.y + 2; y++) {
					if (x === ship.x && y === ship.y) {continue}
					if (x <= 9 && x >= 0 && y <= 9 && y >= 0) {
						this.addIsChecks({x,y});
					}
				}
			}
		}
		if (ship.direct === 1) {
			for (let x=ship.x - 1; x<ship.x + 2; x++) {
				for (let y=ship.y - 1; y<ship.y + ship.size + 1; y++) {
					if (x === ship.x && y === ship.y) {continue}
					if (x <= 9 && x >= 0 && y <= 9 && y >= 0) {
						this.addIsChecks({x,y});
					}
				}
			}
		}
	}

	//попадание в корабль
	getShipHit(ship,x,y) {
		ship.live = ship.live - 1;
		if (game.camp.level === 4 || game.camp.level === 5) {
			this.removeCheckenField(ship);
		}
		if (game.camp.level === 3) {
			if (ship.live === ship.size - 2 && ship.size > 2) {
				this.removeCheckenField(ship);
			}
		}
		game.hitStatus = 'попал';
		playSound('sound-hit');
		game.stop = 0;
		setTimeout( function() {game.stop = 1;},rnd);
		if (ship.live===0) {
			this.addDeadShips(ship);
			this.getCheckAroundDeadShip(ship,x,y);
			game.hitStatus = 'убил';
			playSound('sound-kill');
			game.stop = 0;
		}
	}

	//получает корабль под точкой попадания (x;y)
	getShipInPoint (x, y) {
		for (const ship of this.ships) {
			let dx = ship.direct === 0;
			let dy = ship.direct === 1;
			for (let i=0; i<ship.size; i++) {
				if (ship.x === x && ship.y === y) {
					this.getShipHit(ship,ship.x,ship.y);
					return ship;
				}
				if (ship.x === x - i && ship.y === y) {
					if (ship.direct === 0) {
						this.getShipHit(ship,ship.x,ship.y);
						return ship;
					}
				}
				if (ship.x === x && ship.y === y - i) {
					if (ship.direct === 1) {
						this.getShipHit(ship,ship.x,ship.y);
						return ship;
					}
				}
			}
		}
		return null;
	}
}