// MyGame.screens['game-play'] = (function (game, graphics, input) {
// 	'use strict';

// 	var mouseCapture = false,
// 		//myMouse = input.Mouse(),
// 		//myKeyboard = input.Keyboard(),
// 		cancelNextRequest = false,
// 		lastTimeStamp;

// 	var theParticles = null;

// 	function initialize() {
// 		console.log('game initializing...');

// 		/*theParticles = graphics.Particle({
// 			speed: { mean: 0.07, stdev: 0.025 },
// 			lifetime: { mean: 500, stdev: 250 },
// 		});*/
// 		/*document.getElementById('id-game-home').addEventListener(
// 			'click',
// 			function () {
// 				game.showScreen('main-menu');
// 				theBall.resetBall();
// 				bonusBall.resetBall();
// 				bonusBall.hide();
// 				thePaddle.resetPaddle();
// 				theScore.reset();
// 				theBlocks.reset();
// 				cancelNextRequest = true;
// 			}
//         );*/

// 		//myKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, thePaddle.moveRight);
// 		//myKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, thePaddle.moveLeft);
// 	}

// 	function processInput(elapsedTime) {
// 		//myKeyboard.processInput(elapsedTime);
// 	}

// 	function update(elapsedTime) {
// 		//myKeyboard.update(elapsedTime);
// 		//myMouse.update(elapsedTime);

// 		//theParticles.update(elapsedTime);
// 	}

// 	function render() {
// 		graphics.clear();
		
// 	}

// 	//------------------------------------------------------------------
// 	//
// 	// This is the Game Loop function!
// 	//
// 	//------------------------------------------------------------------
// 	function gameLoop(currentTime) {

// 		let elapsedTime = currentTime - lastTimeStamp;
// 		totalTime += elapsedTime;
// 		lastTimeStamp = currentTime;
// 		processInput(elapsedTime);
// 		update(elapsedTime);
// 		render();

// 		if (!cancelNextRequest) {
// 			requestAnimationFrame(gameLoop);
// 		}
// 	}

// 	function run() {
// 		lastTimeStamp = performance.now();
// 		//
// 		// Start the animation loop
// 		cancelNextRequest = false;
// 		requestAnimationFrame(gameLoop);
// 	}

// 	return {
// 		initialize: initialize,
// 		run: run
// 	};
// }(MyGame.game, MyGame.graphics, MyGame.input));
