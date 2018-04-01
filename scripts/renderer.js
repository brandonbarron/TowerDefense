// ------------------------------------------------------------------
//
//
// ------------------------------------------------------------------

MyGame.graphics = (function () {
	'use strict';

	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');

	let blockWidth = 60;
	let blockHeight = 20;
	let origPaddleWidth = 100;
	let paddleWidth = origPaddleWidth;
	let smallPaddleWidth = paddleWidth / 2;
	let paddleHeight = 20;
	//
	// Place a 'clear' function on the Canvas prototype, this makes it a part
	// of the canvas, rather than making a function that calls and does it.
	CanvasRenderingContext2D.prototype.clear = function () {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};

	//------------------------------------------------------------------
	//
	// Public method that allows the client code to clear the canvas.
	//
	//------------------------------------------------------------------
	function clear() {
		context.clear();
	}

	function Blocks() {
		var that = {};
		let blocks = [];
		let startY = 100;
		let startX = 5;
		//let blockWidth = 60;
		//let blockHeight = 20;
		let blockSpace = 6;


		function createBlocks() {
			for (let i = 0; i < 8; i++) {
				let color = "#01FF1F";
				switch (i) {
					case 2:
					case 3:
						color = "#0078FF";
						break;
					case 4:
					case 5:
						color = "#FF9A00";
						break;
					case 6:
					case 7:
						color = "#E3FF00";
						break;
				}
				for (let j = 0; j < 15; j++) {
					blocks.push({
						x: (j * (blockWidth + blockSpace)) + startX,
						y: (i * (blockHeight + blockSpace)) + startY,
						color: color,
						isBroke: false
					});
				}
			}
		}
		createBlocks();

		that.reset = function () {
			blocks = [];
			startY = 100;
			startX = 5;
			createBlocks();
		}

		that.draw = function () {
			context.save();
			context.beginPath();
			for (let i = 0; i < blocks.length; i++) {
				let block = blocks[i];
				if (i % 30 === 0) {
					context.closePath();
					context.beginPath();
				}
				if (!block.isBroke) {
					context.rect(block.x, block.y, blockWidth, blockHeight);
					context.fillStyle = block.color;
					context.fill();
				}
			}
			context.closePath();
			context.restore();
		};

		that.getBlocks = function () {
			return blocks;
		}

		return that;
	}

	function Ball(beHidden) {
		var that = {};

		let hidden = beHidden;
		let isBonusBall = beHidden;//its going to be true..

		let baseSpeed = 3;
		let speed = baseSpeed;
		var x = canvas.width / 2;
		var y = canvas.height - 30 - 10;
		var speedX = speed;
		var speedY = -speed;
		var radius = 10;
		let go = false;
		let brokeCounter = 0;
		let speedStep = 0;
		let prevAdjust = 0;

		that.resetBall = function () {
			x = canvas.width / 2;
			y = canvas.height - 30 - 10;
			speedX = baseSpeed;
			speedY = -baseSpeed;
			go = false;
			speedStep = 0;
		}

		function breakBlocks(theBlocks, theParticles) {
			let numBroke = 0;
			let brokeGreen = false;
			for (let i = 0; i < theBlocks.length; i++) {
				let block = theBlocks[i];
				if (!block.isBroke) {
					if (x + radius > block.x
						&& x - radius < block.x + blockWidth
						&& y + radius > block.y
						&& y - radius < block.y + blockHeight
					) {
						theParticles.addParticle(block);
						speedY = -speedY;
						block.isBroke = true;
						numBroke++;
						brokeCounter++;
						speedX -= prevAdjust;
						prevAdjust = 0;
						if (i < 15) {
							brokeGreen = true;
						}
						break;
						//return 1;
					}
				}
			}
			return {
				numBroke: numBroke,
				brokeGreen: brokeGreen
			}
		}

		function updateSpeed() {
			if (brokeCounter >= 62 && speedStep == 3) {
				speedX = baseSpeed * 2;
				speedY = baseSpeed * 2;
				speedStep = 4;
			} else if (brokeCounter >= 36 && speedStep == 2) {
				speedX = baseSpeed * 1.6;
				speedY = baseSpeed * 1.6;
				speedStep = 3;
			} else if (brokeCounter >= 12 && speedStep == 1) {
				speedX = baseSpeed * 1.4;
				speedY = baseSpeed * 1.4;
				speedStep = 2;
			} else if (brokeCounter >= 4 && speedStep == 0) {
				speedX = baseSpeed * 1.2;
				speedY = baseSpeed * 1.2;
				speedStep = 1;
			}
		}


		that.update = function (paddleLoc, theBlocks, theParticles) {
			let numBroke = 0;
			let died = false;
			let brokeGreen = false;

			if (go && !hidden) {
				if (x + speedX < radius || x + speedX > canvas.width - radius) {
					speedX -= prevAdjust;
					prevAdjust = 0;
					speedX = -speedX;
				}
				if (y + speedY > canvas.height - radius) {
					died = true;
					that.resetBall();
					brokeCounter = 0;
				} else if (y + speedY < radius || y + speedY > canvas.height - radius) {
					speedY = -speedY;
				} else if (y + speedY > paddleLoc.y - radius) {
					if (x + speedX > paddleLoc.x1 && x + speedX < paddleLoc.x2) {
						speedY = -speedY;
						y = paddleLoc.y - radius;
						let ballCenter = x;
						let paddleWidth = paddleLoc.x2 - paddleLoc.x1
						let paddleCenter = paddleLoc.x1 + ((paddleWidth) / 2);
						let adjust = ((ballCenter - paddleCenter) / (paddleWidth / 2) * Math.abs(speedX));
						speedX -= prevAdjust;
						prevAdjust = adjust;
						speedX += adjust;

					}
				} else {
					let result = breakBlocks(theBlocks, theParticles)
					numBroke = result.numBroke;
					brokeGreen = result.brokeGreen;
				}

				x = x + speedX;
				y = y + speedY;
			}
			updateSpeed();
			return {
				numBroke: numBroke,
				died: died,
				brokeGreen: brokeGreen
			}
		}



		that.start = function () {
			go = true;
		}

		that.draw = function () {
			if (!hidden) {
				///////////////////
				context.beginPath();
				context.arc(x, y, radius, 0, Math.PI * 2);
				context.fillStyle = isBonusBall ? "#0000FF" : "#FF0000";
				context.fill();
				context.closePath();
			}
		};

		that.startSecondBall = function (paddleLoc) {
			hidden = false;
			x = paddleLoc.x1 + ((paddleLoc.x2 - paddleLoc.x1) / 2);
			y = paddleLoc.y - 10;
			speedX = baseSpeed;
			speedY = -baseSpeed;
			go = true;
			speedStep = 0;
		}

		that.hide = function () {
			hidden = true;
		}

		that.getLocAndDim = function () {
			return {
				x: x,
				y: y,
				radius: radius
			};
		}

		return that;
	}

	function Paddle() {
		var that = {};


		var x = (canvas.width / 2) - (paddleWidth / 2);
		var y = canvas.height - 30;
		var speed = 15;

		that.update = function () {

		}

		that.smallPaddle = function () {
			paddleWidth = smallPaddleWidth
		}

		that.moveLeft = function () {
			if (x > 0) {
				x -= speed;
			}
		}

		that.moveRight = function () {
			if (x + paddleWidth < canvas.width) {
				x += speed;
			}
		}

		that.draw = function () {
			context.beginPath();
			context.rect(x, y, paddleWidth, paddleHeight);
			context.fillStyle = '#BD00FF';
			context.fill();
			context.stroke();
			context.closePath();

		};

		that.getLocAndDim = function () {
			return {
				x1: x,
				x2: x + paddleWidth,
				y: y,
			};
		}

		that.resetPaddle = function () {
			x = (canvas.width / 2) - (paddleWidth / 2);
			y = canvas.height - 30;
			paddleWidth = origPaddleWidth;
		}

		return that;
	}

	function Particle(spec) {
		var that = {};
		let particles = [];


		that.update = function (elapsedTime) {
			let keepMe = [];

			for (let particle = 0; particle < particles.length; particle++) {
				particles[particle].alive += elapsedTime;
				particles[particle].position.x += (elapsedTime * particles[particle].speed * particles[particle].direction.x);
				particles[particle].position.y += (elapsedTime * particles[particle].speed * particles[particle].direction.y);
				particles[particle].rotation += particles[particle].speed / .5;

				if (particles[particle].alive <= particles[particle].lifetime) {
					keepMe.push(particles[particle]);
				}
			}

			particles = keepMe;
		}

		function drawRectangle(position, size, rotation, fill, stroke) {
			context.save();
			context.translate(position.x + size / 2, position.y + size / 2);
			context.rotate(rotation);
			context.translate(-(position.x + size / 2), -(position.y + size / 2));

			context.fillStyle = fill;
			//context.strokeStyle = stroke;
			context.fillRect(position.x, position.y, size, size);
			//context.strokeRect(position.x, position.y, size, size);

			context.restore();
		}

		that.draw = function () {
			for (let particle = 0; particle < particles.length; particle++) {
				if (particles[particle].alive >= 100) {
					drawRectangle(
						particles[particle].position,
						particles[particle].size,
						particles[particle].rotation,
						particles[particle].fill,
						particles[particle].stroke);

				}
			}
		};

		that.addParticle = function (theBlock) {
			let partSize = 1;
			for (let i = 0; i < 25; i++) {
				for (let j = 0; j < 50; j++) {
					let p = {
						position: {
							x: theBlock.x + (j * partSize),
							y: theBlock.y + (i * partSize)
						},
						direction: Random.nextCircleVector(),
						speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),	// pixels per millisecond
						rotation: 0,
						lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// milliseconds
						alive: 0,
						size: partSize,//Random.nextGaussian(spec.size.mean, spec.size.stdev),
						fill: theBlock.color,
						//stroke: 'rgb(0, 0, 0)'
					};
					particles.push(p);
				}
			}
		}

		return that;
	}

	function ScoreKeep() {
		var that = {};
		let score = 0;
		let lives = 2;
		let gameOver = false;
		let countDown = 3;
		let startCountdownTime = 0;
		let timeSoFar = 0;
		let bonusBallOn = false;
		let nextBonusBall = 100;
		let scoreRecorded = false;

		function calcScore(theBlocks) {
			score = 0;
			let rowCount = 0;
			for (let i = 0; i < theBlocks.length; i++) {
				let block = theBlocks[i];
				if (block.isBroke) {
					if (i < 30) {
						score += 5;
					} else if (i < 60) {
						score += 3;
					} else if (i < 90) {
						score += 2;
					} else {
						score += 1;
					}
					rowCount++;
					if (rowCount === 15 && i % 15 === 0) {
						score += 25;
					} else if (i % 15 === 0) {
						rowCount = 0;
					}

				}
			}
		}

		that.reset = function () {
			score = 0;
			lives = 2;
			gameOver = false;
			countDown = 3;
			startCountdownTime = 0;
			timeSoFar = 0;
			bonusBallOn = false;
			nextBonusBall = 100;
		}

		that.update = function (ballState, bonusBallState, timeElapsed, theBlocks) {
			let canGo = false;
			if (countDown > 0) {
				timeSoFar += timeElapsed;
				if (1000 < timeSoFar) {
					countDown--;
					timeSoFar = 0;
				}
				if (countDown === 0) {
					canGo = true;
					timeSoFar = 0;
				}
			}
			calcScore(theBlocks)
			//score += ballState.numBroke
			if (ballState.died) {
				lives--;
				countDown = 3;
				startCountdownTime = timeElapsed;
			}

			let startBonusBall = false;
			if (score > nextBonusBall) {
				startBonusBall = true;
				nextBonusBall += 100;
			}

			if (lives < 0) {
				gameOver = true;
			}

			if ((gameOver || score >= 430) && !scoreRecorded) {
				scoreRecorded = true;

				let previousScores = localStorage.getItem('MyGame.highScores');
				let highScores = {};
				if (previousScores !== null) {
					highScores = JSON.parse(previousScores);
				}

				let scoresArray = [];
				for (let key in highScores) {
					scoresArray.push(highScores[key]);
				}
				scoresArray.push(score);

				scoresArray.sort(function (a, b) { return b - a; })

				let newScores = {};
				for (let i = 0; i < scoresArray.length; i++) {
					newScores[i] = scoresArray[i];
				}
				localStorage['MyGame.highScores'] = JSON.stringify(newScores);

			}


			return {
				gameOver: gameOver,
				canGo: canGo,
				startBonusBall: startBonusBall
			}
		}

		that.draw = function () {
			//score
			context.font = "16px Arial";
			context.fillStyle = "#CCCCCC";
			context.fillText("Score: " + score, canvas.width - 90, canvas.height - 10);

			//lives
			context.beginPath();
			for (let i = 0; i < lives; i++) {
				context.rect(canvas.width - (i * (paddleWidth + 10)) - paddleWidth - 10, 8, paddleWidth, paddleHeight);
				context.fillStyle = '#BD00FF';
				context.fill();
				context.stroke();
			}
			context.closePath();

			if (countDown > 0 && !gameOver) {
				context.font = "72px Arial";
				context.fillStyle = "#CCCCCC";
				context.fillText(countDown, 475, 400);
			}

			if (score >= 430) {
				context.font = "72px Arial";
				context.fillStyle = "#CCCCCC";
				context.fillText("You Win!", 350, 400);
				gameOver = true;
			} else if (gameOver && score < 430) {
				context.font = "72px Arial";
				context.fillStyle = "#CCCCCC";
				context.fillText("Game Over", 350, 400);
			}
		};

		return that;
	}

	return {
		clear: clear,
		Blocks: Blocks,
		Ball: Ball,
		Paddle: Paddle,
		ScoreKeep: ScoreKeep,
		Particle: Particle
	};
}());
