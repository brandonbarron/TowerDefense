MyGame.screens['high-scores'] = (function(game) {
	'use strict';
	
	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });
	}

	function report() {
		var htmlNode = document.getElementById('high-scores-list');
		var highScores = {},
			previousScores = localStorage.getItem('MyGame.highScores');
		if (previousScores !== null) {
			highScores = JSON.parse(previousScores);
		}
		
		htmlNode.innerHTML = '';
		for (let key in highScores) {
			htmlNode.innerHTML += (highScores[key] + '<br/>'); 
		}
		htmlNode.scrollTop = htmlNode.scrollHeight;
	}
	
	function run() {
		report();
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));
