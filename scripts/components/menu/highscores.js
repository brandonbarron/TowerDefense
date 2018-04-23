Menu.screens['high-scores'] = (function (menu) {

	let that = {}, htmlNode, highScores, previousScores;

	that.initialize = function () {
		htmlNode = document.getElementById('high-scores-list');
		previousScores = null;
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function () { menu.showScreen('main-menu'); });
	}

	that.run = function () {
		highScores = {};
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

	return that;
}(Menu.menu));
