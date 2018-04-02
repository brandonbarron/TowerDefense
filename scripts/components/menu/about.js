Menu.screens['about'] = (function(menu) {
	'use strict';
	
	function initialize() {
		document.getElementById('id-about-back').addEventListener(
			'click',
			function() { menu.showScreen('main-menu'); });
	}
	
	function run() { }
	
	return {
		initialize : initialize,
		run : run
	};
}(Menu.menu));
