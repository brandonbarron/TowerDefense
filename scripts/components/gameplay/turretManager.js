Game.turretManager = function (graphics, missileManager) {
	'use strict';

	let that = {};
	let allTurrets = [];
	let nextMissileId = 1;

	function AnimatedModel(spec) {
		var that = {};
		var sprite = graphics.SpriteSheet({
			spriteSheet: 'assets/turret-1-1.png',
			sprite: 0,
			spriteCount: 1,
			spriteTime: [1000],	// milliseconds per sprite animation frame
			center: { x : spec.center.x, y : spec.center.y },
			rotation: 0,//spec.rotation,
			//orientation: 0,				// Sprite orientation with respect to "forward"
			rotateRate: (3.14159 / 1000) * 6		// Radians per millisecond
			}
		);
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
		let target = { x: 0, y : 0 };
		let fireTime = 1000;
		let totalTime = 0;
		let shootRange = 350;
		let isSelected = false;
		let upgradeLevel = 1;
		//from sample code
		function crossProduct2d(v1, v2) {
			return (v1.x * v2.y) - (v1.y * v2.x);
		}
		
		function computeAngle(rotation, ptCenter, ptTarget) {
			var v1 = {
					x : Math.cos(rotation),
					y : Math.sin(rotation)
				},
				v2 = {
					x : ptTarget.x - ptCenter.x,
					y : ptTarget.y - ptCenter.y
				},
				dp,
				angle;
	
			v2.len = Math.sqrt((v2.x * v2.x) + (v2.y * v2.y));
			v2.x /= v2.len;
			v2.y /= v2.len;
	
			dp = (v1.x * v2.x) + (v1.y * v2.y);
			angle = Math.acos(dp);
	
			//
			// Get the cross product of the two vectors so we can know
			// which direction to rotate.
			let cp = crossProduct2d(v1, v2);
	
			return {
				angle : angle,
				crossProduct : cp
			};
		}
	
		function testTolerance(value, test, tolerance) {
			if (Math.abs(value - test) < tolerance) {
				return true;
			} else {
				return false;
			}
		}

		
		that.update = function (elapsedTime, gameRunning) {
			if(!gameRunning){
				//return;
				spec.rotation = 0;
			}
			//console.log(spec.rotation);
			baseSprite.update(elapsedTime);
			sprite.update(elapsedTime);
			
			let radius = 4.0;
			let speed = 0.1;
			let timeRemaining = 1500;

			let shouldFire = true;
			let theRotation = sprite.getRot();
			//TODO: I have no idea why its always 90 degrees off
			var result = computeAngle(theRotation - 1.570796, spec.center, target);
			if (testTolerance(result.angle, 0, 0.01) === false) {
				shouldFire = false;
				if (result.crossProduct > 0) {
					sprite.rotateRight(spec.rotateRate);
					//spec.rotation += spec.rotateRate;
				} else {
					sprite.rotateLeft(spec.rotateRate);
					//spec.rotation -= spec.rotateRate;
				}
			} else {
				let dist = Math.sqrt(Math.pow(target.x - spec.center.x, 2) + Math.pow(target.y - spec.center.y, 2))
				if(dist > shootRange) {
					shouldFire = false;
				}
			}
			totalTime += elapsedTime;
			if(totalTime > fireTime && shouldFire) {
				//console.log('shooting');
				missileNew({
					id: nextMissileId++,
            		radius: radius,
            		speed: speed,
            		direction: theRotation - 1.570796,
            		position: {
                		x: spec.center.x,
                		y: spec.center.y
            		},
            		timeRemaining: timeRemaining
				});
				fireTime += 750;
			}
		};

		that.render = function () {
			//graphics.drawImage({image: baseImg, x: 0, y: 0, w: 40, h: 40});
			//baseSprite.draw();
			if(isSelected) {
				graphics.drawCircle(spec.center, 20, { start: 0, end: 2 * Math.PI }, '#0000FF');
			}
			baseSprite.draw();
			sprite.draw();
		};

		/*that.rotateRight = function (elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime);
		};

		that.rotateLeft = function (elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime);
		};*/

		that.getLoc = function () {
			return {
				x: spec.center.x,
				y: spec.center.y,
				rotation: spec.rotation
			}
		};

		that.setTarget = function(x, y) {
			target = {
				x : x,
				y : y
			};
		};

		that.selected = function() {
			isSelected = true;
		}

		that.unselect = function() {
			isSelected = false;
		}

		that.isItSelected = function() {
			return isSelected;
		}

		that.setShootRange = function(newRange) {
			shootRange = newRange;
		}

		that.getShootRange = function() {
			return shootRange;
		}

		function missileNew(data) {
			missileManager.addMissile(data);
		}
		
		that.canUpgrade = function() {
			return upgradeLevel < 3;
		}

		that.upgradeTurret = function() {
			upgradeLevel++;
			console.log(upgradeLevel);
		}

		return that;
	}
	let chooseTurretX = 0;
	let chooseTurretY = 0;
	let chooseTurretType = 0;
	let isChoosingTurretLoc = false;
	let isShowFireDistance = false;

	function findClosestSprite(turret, allSprites) {
		let bestI = 0;
		let bestDist = 1000000000;
		for(let i = 0; i < allSprites.length; i++) {
			let spriteLoc = allSprites[i].getLoc();
			let turretLoc = turret.getLoc();
			let dist = Math.sqrt(Math.pow(spriteLoc.x - turretLoc.x, 2) + Math.pow(spriteLoc.y - turretLoc.y, 2))
			if(bestDist > dist) {
				bestI = 0;
				bestDist = dist;
			}
		}
		return bestI;
	}

	function isNearOtherTurret(x, y) {
		for (let i = 0; i < allTurrets.length; i++) {
			let loc = allTurrets[i].getLoc();
			let turSize = 20;
			let left = loc.x - turSize;
			let right = loc.x + turSize;
			let top = loc.y - turSize;
			let bot = loc.y + turSize;

			if(isBetween(left, right, x) && isBetween(top, bot, y)) {
				return true;
			}
		}
		return false;
	}


	that.update = function (elapsedTime, gameRunning, allSprites) {
		for (let i = 0; i < allTurrets.length; i++) {
			//allTurrets[i].rotateRight(elapsedTime);
			let spriteI = findClosestSprite(allTurrets[i], allSprites);
			let spriteLoc = allSprites[spriteI].getLoc();
			allTurrets[i].setTarget(spriteLoc.x, spriteLoc.y)
			allTurrets[i].update(elapsedTime, gameRunning);
		}
	};

	that.render = function () {
		for (let i = 0; i < allTurrets.length; i++) {
			allTurrets[i].render();
			if(isShowFireDistance) {
				let range = allTurrets[i].getShootRange();
				graphics.drawCircle(allTurrets[i].getLoc(), range, { start: 0, end: 2 * Math.PI }, 'rgba(100, 100, 100, 0.1)');
			}
		}

		if(isChoosingTurretLoc) {
			console.log('choosing turret');
			let turretRange = 75;
			switch(chooseTurretType){
				case 1:
					turretRange = 75;
					break;
			}
			let loc = {
				x: chooseTurretX,
				y: chooseTurretY
			}

			let color = 'rgba(0, 0, 255, 0.5)'
			if(isNearOtherTurret(chooseTurretX, chooseTurretY)) {
				color = 'rgba(255, 0, 0, 0.5)'
			}

			graphics.drawCircle(loc, turretRange, { start: 0, end: 2 * Math.PI }, color);
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
			//orientation: 0,				// Sprite orientation with respect to "forward"
			rotateRate: (3.14159 / 1000) * 6		// Radians per millisecond
		}));
	};

	function isBetween(a, b, x) {
		return x >= a && x <= b;
	}

	that.selectTurret = function(x, y) {
		let selectOne = false;
		if(y > 685) {
			return; //short curcuit!!!!!!!!!!!!!
		}
		for (let i = 0; i < allTurrets.length; i++) {
			let loc = allTurrets[i].getLoc();
			let turSize = 20;
			let left = loc.x - turSize;
			let right = loc.x + turSize;
			let top = loc.y - turSize;
			let bot = loc.y + turSize;

			if(isBetween(left, right, x) && isBetween(top, bot, y) && !selectOne) {
				allTurrets[i].selected();
				selectOne = true;
			} else {
				allTurrets[i].unselect();
			}
		}
		return selectOne;
	}

	function getSelected(){
		for (let i = 0; i < allTurrets.length; i++) {
			if(allTurrets[i].isItSelected()) {
				return allTurrets[i];
			}
		}
		return null;
	}

	that.chooseTurretLoc = function(x, y) {
		chooseTurretX = x;
		chooseTurretY = y;
	}

	that.placeNewTurret = function(x, y) {
		chooseTurretX = x;
		chooseTurretY = y;
		isChoosingTurretLoc = false;
		allTurrets.push(AnimatedModel({
			spriteSheet: 'assets/turret-1-1.png',
			sprite: 0,
			spriteCount: 1,
			spriteTime: [1000],	// milliseconds per sprite animation frame
			center: { x: x, y: y },
			rotation: 0,
			//orientation: 0,				// Sprite orientation with respect to "forward"
			rotateRate: (3.14159 / 1000) * 6		// Radians per millisecond
		}));
	}

	that.chooseTurretTypes = function(theType) {
		isChoosingTurretLoc = true;
		chooseTurretType = theType;
	}

	that.upgradeTurret = function() {
		let selected = getSelected();
		if(selected) {
			selected.upgradeTurret();
		}
	}

	that.sellSelectedTurret = function() {
		for (let i = 0; i < allTurrets.length; i++) {
			if(allTurrets[i].isItSelected()){
				allTurrets.splice(i, 1);
				return;
			}
		}
	}

	that.toggleShowFireDistance = function() {
		isShowFireDistance = !isShowFireDistance;
	}

	that.canUpgrade = function() {
		let selected = getSelected();
		if(selected) {
			return selected.canUpgrade();
		}
		return false;
	}

	that.reset = function () {
		allTurrets.length = 0;
	};

	return that;
}(Game.graphics, Game.missileManager);
