//------------------------------------------------------------------
//
// Defines an animated model object.  The spec is defined as:
// {
//		spriteSheet: Image,
//		spriteSize: { width: , height: },	// In world coordinates
//		spriteCenter: { x:, y: },			// In world coordinates
//		spriteCount: Number of sprites in the sheet,
//		spriteTime: [array of times (milliseconds) for each frame]
// }
//
//------------------------------------------------------------------
Game.spriteManager = function (graphics) {
    'use strict';

    let that = {};
    let allSprites = [];

    //------------------------------------------------------------------
	//
	// Defines a game object/model that animates simply due to the passage
	// of time.
	//
	//------------------------------------------------------------------
	function AnimatedModel(spec) {
		var that = {};
		let sprite = graphics.SpriteSheet(spec);	// We contain a SpriteSheet, not inherited from, big difference
        
		that.update = function(elapsedTime) {
			sprite.update(elapsedTime);
		};
		
		that.render = function() {
			sprite.draw();
		};
		
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime);
		};
		
		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime);
		};
		
		//------------------------------------------------------------------
		//
		// Move in the direction the sprite is facing
		//
		//------------------------------------------------------------------
		that.moveForward = function(elapsedTime) {
			//
			// Create a normalized direction vector
			var vectorX = Math.cos(spec.rotation + spec.orientation),
				vectorY = Math.sin(spec.rotation + spec.orientation);
			//
			// With the normalized direction vector, move the center of the sprite
			//console.log(spec, 'spec');
			spec.center.x += (vectorX * spec.moveRate * elapsedTime);
			spec.center.y += (vectorY * spec.moveRate * elapsedTime);
		};
		
		//------------------------------------------------------------------
		//
		// Move in the negative direction the sprite is facing
		//
		//------------------------------------------------------------------
		that.moveBackward = function(elapsedTime) {
			//
			// Create a normalized direction vector
			var vectorX = Math.cos(spec.rotation + spec.orientation),
				vectorY = Math.sin(spec.rotation + spec.orientation);
			//
			// With the normalized direction vector, move the center of the sprite
			spec.center.x -= (vectorX * spec.moveRate * elapsedTime);
			spec.center.y -= (vectorY * spec.moveRate * elapsedTime);
		};

		that.getLoc = function() {
			return {
				x: spec.center.x,
				y: spec.center.y,
				rotation: spec.rotation
			}
		};
		
		return that;
	}
	
	//------------------------------------------------------------------
	//
	// Defines a game object/model that animates based upon the elapsed time
	// that occurs only when moving.
	//
	//------------------------------------------------------------------
	function AnimatedMoveModel(spec) {
		var that = AnimatedModel(spec),	// Inherit from AnimatedModel
			base = {
				moveForward : that.moveForward,
				moveBackward : that.moveBackward,
				rotateRight : that.rotateRight,
				rotateLeft : that.rotateLeft,
				update : that.update
			},
			didMoveForward = false,
			didMoveBackward = false;
			
		//------------------------------------------------------------------
		//
		// Replacing the update function from the base object.  In this update
		// we check to see if any movement was performed, if so, then the animation
		// is updated.
		//
		//------------------------------------------------------------------
		that.update = function(elapsedTime) {
			if (didMoveForward === true) {
				base.update(elapsedTime, true);
			} else if (didMoveBackward === true) {
				base.update(elapsedTime, false);
			}
			
			didMoveForward = false;
			didMoveBackward = false;
		};
		
		that.moveForward = function(elapsedTime) {
			base.moveForward(elapsedTime);
			didMoveForward = true;
		};
		
		that.moveBackward = function(elapsedTime) {
			base.moveBackward(elapsedTime);
			didMoveBackward = true;
		};
		
		that.rotateRight = function(elapsedTime) {
			base.rotateRight(elapsedTime);
			didMoveForward = true;
		};
		
		that.rotateLeft = function(elapsedTime) {
			base.rotateLeft(elapsedTime);
			didMoveForward = true;
		};
		
		return that;
	}
	
	function updateLoc(sprite, elapsedTime) {
		let loc = sprite.getLoc();
		if(loc.x < 200) {
			sprite.moveForward(elapsedTime);
		} else if(loc.rotation < 1.57)  {
			//sprite.moveForward();
			sprite.rotateRight(elapsedTime);
			sprite.rotateRight(elapsedTime+50);
		} else if(loc.y < 200) {
			sprite.moveForward(elapsedTime);
		}
	};
    
    that.update = function(elapsedTime) {
        for(let i = 0; i < allSprites.length; i++) {
			updateLoc(allSprites[i], elapsedTime);
            allSprites[i].update(elapsedTime);
		}
    };

    that.render = function() {
        for(let i = 0; i < allSprites.length; i++) {
            allSprites[i].render();
        }
    };

    that.addMovingSprite = function(spec) {
        allSprites.push(AnimatedMoveModel(spec));
    };
    
    that.addSprite = function(spec) {
        allSprites.push(AnimatedModel(spec));
	};
	
	that.addTestSprite = function() {
		allSprites.push(AnimatedModel({
			spriteSheet : 'assets/creep1-blue.png',
			spriteCount : 6,
			sprite: 0,
			spriteTime : [1000, 200, 100, 1000, 100, 200],	// milliseconds per sprite animation frame
			center : { x : 23, y : 23 },
			rotation : 0,
			orientation : 0,				// Sprite orientation with respect to "forward"
			moveRate : 200 / 10000,			// pixels per millisecond
			rotateRate : 3.14159 / 1000		// Radians per millisecond
		}));
	};

	that.reset = function() {
		allSprites.length = 0;
	};

	return that;
}(Game.graphics);
