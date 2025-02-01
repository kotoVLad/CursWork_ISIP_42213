function getMouse(element) {
	const mouse = {
		x: 0,
		y: 0,
		click: false,
		scroll: false,
	}
	//Нужна для того, чтобы можно было видеть, что ты навёлся на поле врага.
	//В добавок, без неё нельзя взаимодействовать с полем.
	element.addEventListener('mousemove', function (event) {
		const rect = element.getBoundingClientRect();
		mouse.x = event.clientX - rect.left;
		mouse.y = event.clientY - rect.top;
	});
	// Нужна чтобы можно было взимодействовать с полем врага.
	element.addEventListener('click', function(event) {
		mouse.click = true;
	});
	element.addEventListener('wheel', function(event) {
		mouse.scroll = !mouse.scroll;
	});

	return mouse;
}