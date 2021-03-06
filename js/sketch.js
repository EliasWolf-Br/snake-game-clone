let game;

function setup() {
	// instance class
	game = new Game(20, 20, 30);
}

function draw() {
	// update and draw game
	game.update();

	game.draw();
}

function keyPressed(e) {
	// reset on Z pressed
	if(e.keyCode == 90) setup();
}

function windowResized() {
	// center canvas horizontal
	game.canvas.center("horizontal");
}

class Game {
	constructor(w, h, s) {
		this.size = s; // size of cells
		this.width = w; // width board
		this.height = h; // height board

		this.snake = { // snake
			body: [],
			dir: -1,
			died: false
		};

		for(var a = 0; a < 2; a++) this.snake.body.push(createVector(1, 1)); // add body to snake

		this.food = createVector(randomInt(0, this.width), randomInt(0, this.height)); // food

		this.tick = 0; // runtime

		this.canvas = createCanvas(this.width * this.size, this.height * this.size).center("horizontal"); // canvas
	}

	update() {
		// change snake dir
		if(keyIsDown(37) && this.snake.dir != 1) this.snake.dir = 0;
		if(keyIsDown(39) && this.snake.dir != 0) this.snake.dir = 1;
		if(keyIsDown(38) && this.snake.dir != 3) this.snake.dir = 2;
		if(keyIsDown(40) && this.snake.dir != 2) this.snake.dir = 3;

		this.tick++; // move runtime

		if(this.tick % 4 != 3 || this.snake.died) return; // return if died

		var newSnake = this.snake.body[0].copy(); // copy snake position

		if(this.snake.dir < 0) return;

		switch(this.snake.dir) { // move position
			case 0:
				newSnake.x -= 1;
				break;
			case 1:
				newSnake.x += 1;
				break;
			case 2:
				newSnake.y -= 1;
				break;
			case 3:
				newSnake.y += 1;
				break;
		}

		// warp snake
		if(newSnake.x < 0) newSnake.x = (this.width - 1);
		if(newSnake.x > (this.width - 1)) newSnake.x = 0;
		if(newSnake.y < 0) newSnake.y = (this.height - 1);
		if(newSnake.y > (this.height - 1)) newSnake.y = 0;

		// check snake self-collision
		for(var a = 1; a < this.snake.body.length; a++) {
			var snake = this.snake.body[a];
			if(snake != undefined) {
				if(snake.x == newSnake.x && snake.y == newSnake.y) {
					this.snake.died = true;
					return;
				}
			}
		}
		
		// move snake
		this.snake.body.pop();

		if(this.food.x == newSnake.x && this.food.y == newSnake.y) {
			// eat food?
			this.snake.body.unshift(newSnake);
			this.food = createVector(randomInt(0, this.width), randomInt(0, this.height));
		}

		this.snake.body.unshift(newSnake);
	}

	draw() {
		// draw game
		this.canvas.background(255);

		noStroke();

		// cool effect
		var border = 4; this.canvas.fill(0); this.canvas.rect([(this.food.x * this.size) - border, (this.food.y * this.size) - border, this.size + (border * 2), this.size + (border * 2)]); for(var a = 0; a < this.snake.body.length; a++) this.canvas.rect([(this.snake.body[a].x * this.size) - border, (this.snake.body[a].y * this.size) - border, this.size + (border * 2), this.size + (border * 2)]);

		// draw food
		this.canvas.fill(255, 255, 0);
		this.canvas.rect([this.food.x * this.size, this.food.y * this.size, this.size, this.size]);
		
		// draw snake
		for(var a = 0; a < this.snake.body.length; a++) {
			// gradient effect
			var gradient = (a / (this.snake.body.length - 1)) * 255 || 0;
			this.canvas.fill(gradient, 0, 255 - gradient);
			this.canvas.rect([this.snake.body[a].x * this.size, this.snake.body[a].y * this.size, this.size, this.size]);
		};
	}
}

function randomInt(e, t) {
	return floor(random(e, t));
}
