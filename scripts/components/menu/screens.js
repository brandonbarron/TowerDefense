Menu.screens['main-menu'] = (function(menu) {
	'use strict';
	
	function initialize() {

		document.getElementById('id-new-game').addEventListener(
			'click',
			function() { menu.showScreen('new-game'); });
		
		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { menu.showScreen('high-scores'); });
		
		document.getElementById('id-about').addEventListener(
			'click',
			function() { menu.showScreen('about'); });

		document.getElementById('id-controls').addEventListener(
			'click',
			function() { menu.showScreen('controls'); });
	}
	
	function run() { }
	
	return {
		initialize : initialize,
		run : run
	};
}(Menu.menu));