Game.turretManager = function (graphics, missileManager, grid) {
	'use strict';

	let that = {},
		allTurrets,
		nextMissileId,
		chooseTurretX,
		chooseTurretY,
		chooseTurretType,
		isChoosingTurretLoc,
		isShowFireDistance,
		isInvalidTurretLoc;

	function AnimatedModel(spec) {
		var that = {};
		let upgradeLevel = 1;
		let sprite = graphics.SpriteSheet({
			spriteSheet: spec.spriteSheet[upgradeLevel - 1],
			sprite: 0,
			spriteCount: 1,
			spriteTime: [1000],	// milliseconds per sprite animation frame
			center: { x: spec.center.x, y: spec.center.y },
			rotation: 0,//spec.rotation,
			//orientation: 0,				// Sprite orientation with respect to "forward"
			rotateRate: spec.rotateRate		// Radians per millisecond
		});

		var baseSprite = graphics.SpriteSheet({
			spriteSheet: 'assets/turret-base.png',
			spriteCount: 1,
			spriteTime: [1000],	// milliseconds per sprite animation frame
			center: { x: spec.center.x, y: spec.center.y },
			rotation: 0,
			orientation: 0,				// Sprite orientation with respect to "forward"
			rotateRate: 0		// Radians per millisecond
		});	// We contain a SpriteSheet, not inherited from, big difference
		let target = { x: 0, y: 0 };
		let fireTime = 1000;
		let totalTime = 0;
		let missileSpeed = 0.25;
		//let shootRange = 350;
		let isSelected = false;
		let upgradeTime = 1000;

		//from sample code
		function crossProduct2d(v1, v2) {
			return (v1.x * v2.y) - (v1.y * v2.x);
		}

		function computeAngle(rotation, ptCenter, ptTarget) {
			var v1 = {
				x: Math.cos(rotation),
				y: Math.sin(rotation)
			},
				v2 = {
					x: ptTarget.x - ptCenter.x,
					y: ptTarget.y - ptCenter.y
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
				angle: angle,
				crossProduct: cp
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
			if (!gameRunning) {
				//return;
				spec.rotation = 0;
			}
			if(upgradeTime > 0) {
				upgradeTime -= elapsedTime;
			}
			baseSprite.update(elapsedTime);
			sprite.update(elapsedTime);

			let radius = 4.0;

			let timeRemaining = 1500;

			let shouldFire = true;
			let theRotation = sprite.getRot();
			//TODO: I have no idea why its always 90 degrees off
			var result = computeAngle(theRotation - 1.570796, spec.center, target);
			if (testTolerance(result.angle, 0, 0.05) === false) {
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
				if (dist > spec.shootRange) {
					shouldFire = false;
				}
			}

			totalTime += elapsedTime;
			if (totalTime > fireTime && shouldFire) {
				missileNew({
					id: nextMissileId++,
					radius: radius,
					speed: missileSpeed,
					direction: theRotation - 1.570796,
					position: {
						x: spec.center.x,
						y: spec.center.y
					},
					timeRemaining: spec.shootRange / missileSpeed,
					shootDamage: spec.shootDamage
				});
				fireTime = totalTime + spec.shootFreq;
			}
		};

		that.render = function () {
			//graphics.drawImage({image: baseImg, x: 0, y: 0, w: 40, h: 40});
			//baseSprite.draw();
			if (isSelected) {
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

		that.setTarget = function (x, y) {
			target = {
				x: x,
				y: y
			};
		};

		that.selected = function () {
			isSelected = true;
		}

		that.unselect = function () {
			isSelected = false;
		}

		that.isItSelected = function () {
			return isSelected;
		}

		that.setShootRange = function (newRange) {
			spec.shootRange = newRange;
		}

		that.getShootRange = function () {
			return spec.shootRange;
		}

		function missileNew(data) {
			missileManager.addMissile(data);
		}

		that.canUpgrade = function () {
			return upgradeLevel < 3 && upgradeTime <=0;
		}

		that.getUpgradeCost = function() {
			if(that.canUpgrade()) {
				return spec.upgradeCost * upgradeLevel;
			} 
			return 0;
		}

		that.getSellPrice = function() {
			return (spec.upgradeCost * upgradeLevel) * 0.5;
		}

		that.getLevel = function() {
			return upgradeLevel;
		}

		that.upgradeTurret = function () {
			if(!that.canUpgrade()) {
				return;
			}
			upgradeLevel++;
			upgradeTime = 1000;
			missileSpeed *= 1.5;
			spec.shootRange *= 1.5;
			spec.rotateRate *= 1.5;
			spec.shootFreq *= 0.5;
			sprite = graphics.SpriteSheet({
				spriteSheet: spec.spriteSheet[upgradeLevel - 1],
				sprite: 0,
				spriteCount: 1,
				spriteTime: [1000],	// milliseconds per sprite animation frame
				center: { x: spec.center.x, y: spec.center.y },
				rotation: 0,//spec.rotation,
				//orientation: 0,				// Sprite orientation with respect to "forward"
				rotateRate: spec.rotateRate		// Radians per millisecond
			});
		}

		return that;
	}

	function findClosestSprite(turret, allSprites) {
		let bestI = 0;
		let bestDist = 1000000000;
		let turretLoc = turret.getLoc();
		for (let i = 0; i < allSprites.length; i++) {
			let spriteLoc = allSprites[i].getLoc();

			let dist = Math.sqrt(Math.pow(spriteLoc.x - turretLoc.x, 2) + Math.pow(spriteLoc.y - turretLoc.y, 2));
			if (bestDist > dist) {
				bestI = i;
				bestDist = dist;
			}
		}
		if (bestI === 0) {
			//console.log('no best found');
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

			if (isBetween(left, right, x) && isBetween(top, bot, y)) {
				return true;
			}
		}
		return false;
	}

	that.initialize = function () {
		allTurrets = [];
		nextMissileId = 1;
		chooseTurretX = 0;
		chooseTurretY = 0;
		chooseTurretType = 0;
		isChoosingTurretLoc = false;
		isShowFireDistance = false;
		isInvalidTurretLoc = false;
	}

	that.update = function (elapsedTime, gameRunning, allSprites) {
		for (let i = 0; i < allTurrets.length; i++) {
			//allTurrets[i].rotateRight(elapsedTime);
			let spriteI, spriteLoc;
			if (allSprites.length > 0) {
				spriteI = findClosestSprite(allTurrets[i], allSprites);
				spriteLoc = allSprites[spriteI].getLoc();
				allTurrets[i].setTarget(spriteLoc.x, spriteLoc.y);
				allTurrets[i].update(elapsedTime, gameRunning);
			}
		}
	};

	that.render = function () {
		for (let i = 0; i < allTurrets.length; i++) {
			allTurrets[i].render();
			if (isShowFireDistance) {
				let range = allTurrets[i].getShootRange();
				graphics.drawCircle(allTurrets[i].getLoc(), range, { start: 0, end: 2 * Math.PI }, 'rgba(100, 100, 100, 0.25)');
			}
		}

		if (isChoosingTurretLoc) {
			let turretRange = getTurretRange(chooseTurretType);
			let loc = {
				x: chooseTurretX,
				y: chooseTurretY
			}

			let color = 'rgba(0, 0, 255, 0.5)'
			if (isInvalidTurretLoc) {
				color = 'rgba(255, 0, 0, 0.5)'
			}
			graphics.drawText({ x: 1000, y: 100 }, 'y: ' + loc.y, 'black', '72px Arial');
			graphics.drawText({ x: 1000, y: 200 }, 'x: ' + loc.x, 'black', '72px Arial');
			graphics.drawCircle(loc, turretRange, { start: 0, end: 2 * Math.PI }, color);
		}

	};

	function isBetween(a, b, x) {
		return x >= a && x <= b;
	}

	that.selectTurret = function (x, y) {
		let selectOne = false;

		for (let i = 0; i < allTurrets.length; i++) {
			let loc = allTurrets[i].getLoc();
			let turSize = 20;
			let left = loc.x - turSize;
			let right = loc.x + turSize;
			let top = loc.y - turSize;
			let bot = loc.y + turSize;

			if (isBetween(left, right, x) && isBetween(top, bot, y) && !selectOne) {
				allTurrets[i].selected();
				selectOne = true;
			} else {
				allTurrets[i].unselect();
			}
		}
		return selectOne;
	}

	function getSelected() {
		for (let i = 0; i < allTurrets.length; i++) {
			if (allTurrets[i].isItSelected()) {
				return allTurrets[i];
			}
		}
		return null;
	}

	that.getSelectedLevel = function() {
		let tur = getSelected();
		return tur.getLevel();
	}

	that.getSelectedUpgradeCost = function() {
		let tur = getSelected();
		return tur.getUpgradeCost();
	}

	that.getSelectedSellPrice = function() {
		let tur = getSelected();
		return tur.getSellPrice();
	}

	that.chooseTurretLoc = function (x, y) {
		chooseTurretX = x;
		chooseTurretY = y;
	}

	function getTurretPic(typeNum) {
		switch (typeNum) {
			case 1:
				return [
					'assets/turret-1-1.png',
					'assets/turret-1-2.png',
					'assets/turret-1-3.png'
				];
			case 2:
				return [
					'assets/turret-2-1.png',
					'assets/turret-2-2.png',
					'assets/turret-2-3.png'
				];
			case 3:
				return [
					'assets/turret-3-1.png',
					'assets/turret-3-2.png',
					'assets/turret-3-3.png'
				];
			case 4:
				return [
					'assets/turret-4-1.png',
					'assets/turret-4-2.png',
					'assets/turret-4-3.png'
				];
		}
		return '';
	}

	function getTurretRange(typeNum) {
		switch (typeNum) {
			case 1:
				return 100;
			case 2:
				return 200;
			case 3:
				return 300;
			case 4:
				return 400;
		}
		return 0;
	}

	function getTurretShootFreq(typeNum) {
		switch (typeNum) {
			case 1:
				return 1000;
			case 2:
				return 800;
			case 3:
				return 600;
			case 4:
				return 400;
		}
		return 0;
	}

	function getTurretRotateRate(typeNum) {
		switch (typeNum) {
			case 1:
				return (3.14159 / 1000) * 6;
			case 2:
				return (3.14159 / 1000) * 8;
			case 3:
				return (3.14159 / 1000) * 10;
			case 4:
				return (3.14159 / 1000) * 15;
		}
		return 0;
	}

	function getTurretShootDamage(typeNum) {
		switch (typeNum) {
			case 1:
				return 100;
			case 2:
				return 200;
			case 3:
				return 300;
			case 4:
				return 400;
		}
		return 0;
	}

	function getTurretUpgradeCost(typeNum) {
		switch (typeNum) {
			case 1:
				return 100;
			case 2:
				return 200;
			case 3:
				return 300;
			case 4:
				return 400;
		}
		return 0;
	}

	function getTurretCost(typeNum) {
		switch (typeNum) {
			case 1:
				return 400;
			case 2:
				return 600;
			case 3:
				return 800;
			case 4:
				return 1000;
		}
		return 0;
	}

	that.placeNewTurret = function (row, col, score) {
		if(!score.purchaseIfAble(getTurretCost(chooseTurretType))) {
			return;
		}

		isChoosingTurretLoc = false;

		let turPic = getTurretPic(chooseTurretType);
		let shootRange = getTurretRange(chooseTurretType);
		let shootFreq = getTurretShootFreq(chooseTurretType);
		let rotateRate = getTurretRotateRate(chooseTurretType);
		let shootDamage = getTurretShootDamage(chooseTurretType);
		let upgradeCost = getTurretUpgradeCost(chooseTurretType);

		allTurrets.push(AnimatedModel({
			spriteSheet: turPic,
			sprite: 0,
			spriteCount: 1,
			spriteTime: [1000],	// milliseconds per sprite animation frame
			center: { x: (col * 40) + 60, y: (row * 40) + 40 },
			rotation: 0,
			//orientation: 0,				// Sprite orientation with respect to "forward"
			rotateRate: rotateRate,		// Radians per millisecond
			shootRange: shootRange,
			shootFreq: shootFreq,
			shootDamage: shootDamage,
			upgradeCost: upgradeCost
		}));
		grid.turretPlaced(row, col);
	}

	that.chooseTurretTypes = function (theType) {
		isChoosingTurretLoc = true;
		chooseTurretType = theType;
	}

	that.upgradeTurret = function (score) {
		let selected = getSelected();
		if (selected) {
			if(score.purchaseIfAble(selected.getUpgradeCost())) {
				selected.upgradeTurret();
			}
		}
	}

	that.sellSelectedTurret = function (score) {
		for (let i = 0; i < allTurrets.length; i++) {
			if (allTurrets[i].isItSelected()) {
				let loc = allTurrets[i].getLoc();

				let col = Math.floor((loc.x - 40) / 40);
				let row = Math.floor((loc.y - 20) / 40);
				grid.turretRemoved(row, col);

				let sellAmount = allTurrets[i].getSellPrice();
				score.sellItem(sellAmount);

				allTurrets.splice(i, 1);
				return;
			}
		}
	}

	that.toggleShowFireDistance = function () {
		isShowFireDistance = !isShowFireDistance;
	}

	that.canUpgrade = function () {
		let selected = getSelected();
		if (selected) {
			return selected.canUpgrade();
		}
		return false;
	}

	that.setIsInvalidTurretLoc = function (isInvalid) {
		isInvalidTurretLoc = isInvalid;
	}

	that.reset = function () {
		allTurrets.length = 0;
	};

	return that;
}(Game.graphics, Game.missileManager, Game.grid);
