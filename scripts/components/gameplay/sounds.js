Game.sounds = (function(){
    let that = {},
        shooting,
        placeTurret,
        sellTurret,
        upgradeTurret,
        deathCreep;

    that.initialize = function() {
        shooting = new Audio('assets/sounds/shooting.mp3');
        placeTurret = new Audio('assets/sounds/place_turret.mp3');
        sellTurret = new Audio('assets/sounds/sell_turret.mp3');
        upgradeTurret = new Audio('assets/sounds/upgrade_turret.mp3');
        deathCreep = new Audio('assets/sounds/death_creep.mp3');
    }

    that.shoot = function() { shooting.play(); }
    that.placeTurret = function() { placeTurret.play(); }
    that.sellTurret = function() { sellTurret.play(); }
    that.upgradeTurret = function() { upgradeTurret.play(); }
    that.deathCreep = function() { deathCreep.play(); }

    return that;
}());