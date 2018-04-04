Game.turretManager = function (graphics, missileManager) {
	'use strict';

	let that = {};
	let allTurrets = [];
	let nextMissileId = 1;

	function AnimatedModel(spec) {
		var that = {};
		var sprite = graphics.SpriteSheet(spec);
		var baseSprite = graphics.SpriteSheet({
				spriteSheet : 'assets/turret-base.png',
				spriteCount : 1,
				spriteTime : [1000],	// milliseconds per sprite animation frame
				center : { x : spec.center.x, y : spec.center.y },
				rotation : 0,
				orientation : 0,				// Sprite orientation with respect to "forward"
				rotateRate : 0		// Radians per millisecond
				}
			);	// We contain a SpriteSheet, not inherited from, big difference

		let demoTime = 1000;
		let totalTime = 0;
		that.update = function (elapsedTime) {
			baseSprite.update(elapsedTime);
			sprite.update(elapsedTime);
			
			let radius = 4.0;
			let speed = 0.1;
			let timeRemaining = 1500;

			totalTime += elapsedTime;
			if(totalTime > demoTime) {
				//console.log('shooting');
				missileNew({
					id: nextMissileId++,
            		radius: radius,
            		speed: speed,
            		direction: spec.rotation,
            		position: {
                		x: spec.center.x,
                		y: spec.center.y
            		},
            		timeRemaining: timeRemaining
				});
				demoTime += 750;
			}
		};

		that.render = function () {
			//graphics.drawImage({image: baseImg, x: 0, y: 0, w: 40, h: 40});
			//baseSprite.draw();
			baseSprite.draw();
			sprite.draw();
		};

		that.rotateRight = function (elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime);
		};

		that.rotateLeft = function (elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime);
		};

		that.getLoc = function () {
			return {
				x: spec.center.x,
				y: spec.center.y,
				rotation: spec.rotation
			}
		};

		function missileNew(data) {
			missileManager.addMissile(data);
		}

		return that;
	}


	that.update = function (elapsedTime) {
		for (let i = 0; i < allTurrets.length; i++) {
			allTurrets[i].rotateRight(elapsedTime);
			allTurrets[i].update(elapsedTime);
		}
	};

	that.render = function () {
		for (let i = 0; i < allTurrets.length; i++) {
			allTurrets[i].render();
		}
	};

	that.addTurret = function (spec) {
		allTurrets.push(AnimatedModel(spec));
	};

	that.addTestTurret = function () {
		allTurrets.push(AnimatedModel({
			spriteSheet: 'assets/turret-1-1.png',
			sprite: 0,
			spriteCount: 1,
			spriteTime: [1000],	// milliseconds per sprite animation frame
			center: { x: 300, y: 300 },
			rotation: 0,
			orientation: 0,				// Sprite orientation with respect to "forward"
			rotateRate: 3.14159 / 1000		// Radians per millisecond
		}));
	};

	

	that.reset = function () {
		allTurrets.length = 0;
	};

	return that;
}(Game.graphics, Game.missileManager);
