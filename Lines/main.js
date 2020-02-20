var canvas, ctx;
var lines = [];

function onLoad() {
	canvas = document.getElementById('canvas');
	canvas.width = innerWidth - 20;
	canvas.height = innerHeight - 20;
	ctx = canvas.getContext('2d');

	setInterval(step, 40);
}

function step() {
	if (Math.random() < 0.02) {
		addLine();
	}

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
		isHorizontal: Math.random() < 0.5,
		color: '#ff0000',
		pos: 0,
		vel: 1 + Math.random() * 3,
		width: 2 + Math.random() * 6,
	};
	const oppositeDirectionLines = [];
	for (const _line of lines) {
		if (line.isHorizontal != _line.isHorizontal) {
			oppositeDirectionLines.push(_line);
		}
	}
	if (oppositeDirectionLines.length > 0) {
		line.parent = oppositeDirectionLines[Math.floor(Math.random() * oppositeDirectionLines.length)];
	}

	if (Math.random() < 0.5) {
		line.pos = line.isHorizontal ? canvas.height : canvas.width;
		line.vel *= -1;
	}
	lines.push(line);
}

function paint() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (const line of lines) {
		ctx.lineWidth = line.width;
		ctx.strokeStyle = line.color;
		ctx.beginPath();
		const from = {
			x: line.isHorizontal ? 0 : line.pos,
			y: line.isHorizontal ? line.pos : 0
		};
		const to = {};

		ctx.moveTo(from.x, from.y);
		if (line.parent) {
			to.x = line.isHorizontal ? line.parent.pos : line.pos;
			to.y = line.isHorizontal ? line.pos : line.parent.pos;
		} else {
			to.x = line.isHorizontal ? canvas.width : line.pos;
			to.y = line.isHorizontal ? line.pos : canvas.height;
		}
		ctx.lineTo(to.x, to.y);
		ctx.stroke();
	}
}
