var canvas, ctx;
var lines = [];
var intervalId;
var currLineId = 0;

function onLoad() {
	canvas = document.getElementById('canvas');
	canvas.width = innerWidth - 20;
	canvas.height = innerHeight - 20;
	ctx = canvas.getContext('2d');
	ctx.font = '22px Arial';

	addEventListener('keydown', keyPress);

	lines = [
		{
			id: currLineId++,
			isHorizontal: false,
			color: '#ccaa00',
			pos: 200,
			vel: 6,
			width: 6,
			from: 0,
		}, {
			id: currLineId++,
			isHorizontal: true,
			color: '#ff0000',
			pos: 100,
			vel: 4,
			width: 16,
			from: 0,
			to: 600
		}
	];

	toggleRunning();
}

function step() {
	// if (Math.random() < 0.02) {
	// 	addLine();
	// }

	const newLines = [];
	for (const line of lines) {
		line.pos += line.vel;
		if (line.pos > 0 &&
			((line.isHorizontal && line.pos < canvas.height) || (!line.isHorizontal && line.pos < canvas.width))) {
			newLines.push(line);
		}
	}
	lines = newLines;
	// console.log(lines);
	paint();
}

function addLine() {
	const line = {
		id: currLineId++,
		isHorizontal: Math.random() < 0.5,
		color: '#ff0000',
		pos: 0,
		vel: 1 + Math.random() * 3,
		width: 2 + Math.random() * 6,
		from: 0,
	};
	line.to = line.isHorizontal ? canvas.width : canvas.height;
	if (Math.random() < 0.5) {
		line.pos = line.isHorizontal ? canvas.height : canvas.width;
		line.vel *= -1;
	}
	lines.push(line);
}

function paint() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (const line of lines) {
		line.intersecting = null;
		line.from = 0;
		line.to = line.isHorizontal ? canvas.width : canvas.height;
	}

	for (const line of lines) {
		const from = {
			x: line.isHorizontal ? line.from : line.pos,
			y: line.isHorizontal ? line.pos : line.from
		};

		for (const _line of lines) {
			if (line.isHorizontal != _line.isHorizontal && !_line.intersecting) {
				if ((!line.intersecting || _line.pos < line.intersecting.pos) && _line.to > line.pos && line.from < line.pos) {
					line.intersecting = _line;
				}
				// _line.pos > line.from && _line.pos < line.to && _line.from < line.pos && _line.to > line.pos) {
				// console.log(line);
				// line.to = _line.pos;

				// ctx.lineWidth = 0;
				// ctx.fillStyle = '#00cc00';
				// ctx.beginPath();
				// const p = {
				// 	x: line.isHorizontal ? _line.pos : line.pos,
				// 	y: line.isHorizontal ? line.pos : _line.pos
				// }
				// ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
				// ctx.fill();

				// ctx.fillStyle = '#000000';
				// ctx.fillText(line.id, p.x, p.y);
			}
		}
		if (line.intersecting) {
			line.to = line.intersecting.pos;
		}

		const to = {
			x: line.isHorizontal ? line.to : line.pos,
			y: line.isHorizontal ? line.pos : line.to
		};
		ctx.lineWidth = line.width;
		ctx.strokeStyle = line.color;
		ctx.beginPath();
		ctx.moveTo(from.x, from.y);
		ctx.lineTo(to.x, to.y);
		ctx.stroke();
	}
}

function keyPress(event) {
	if (event.code == 'Space') {
		toggleRunning();
	}
}

function toggleRunning() {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	} else {
		intervalId = setInterval(step, 40);
	}
}
