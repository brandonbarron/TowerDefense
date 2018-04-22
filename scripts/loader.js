Master = {
    input: {},
    components: {},
    renderer: {},
    utilities: {},
    assets: {},
};


Master.loader = (function () {
    'use strict';

    let scriptOrder = [
        {
            scripts: [
                'scripts/components/utility/input.js',
                'scripts/components/utility/objects.js',
                'scripts/components/utility/graphics.js',
            ],
            message: 'utility components loaded',
            onComplete: null,
        },
        {
            scripts: [
                'scripts/components/gameplay/graphics.js',
                'scripts/components/gameplay/grid.js',
                'scripts/components/gameplay/menu.js',
                'scripts/components/gameplay/animatedSprite.js',
                'scripts/components/gameplay/particles.js',
                'scripts/components/gameplay/missile.js',
                'scripts/components/gameplay/missileManager.js',
                'scripts/components/gameplay/spritemanager.js',
                'scripts/components/gameplay/turretManager.js',
                'scripts/components/gameplay/score.js',
                'scripts/components/gameplay/game.js',
            ],
            message: 'game components loaded',
            onComplete: null
        },
        {
            scripts: [
                'scripts/components/menu/menu.js',
                'scripts/components/menu/main.js',
                'scripts/components/menu/about.js',
                'scripts/components/menu/screens.js',
                'scripts/components/menu/highscores.js',
                'scripts/components/menu/newgame.js',
            ],
            message: 'menu components loaded',
            onComplete: null,
        },
    ],
        assetOrder = [
            {
                key: 'player-self',
                source: 'assets/playerShip1_blue.png'
            },
            {
                key: 'player-other',
                source: 'assets/playerShip1_red.png'
            },
            {
                key: 'explosion',
                source: 'assets/explosion.png'
            },
            {
                key: 'background',
                source: 'assets/grassBackground.jpg'
            },
            {
                key: 'creep1',
                source: 'assets/creep1-blue.png'
            },
            {
                key: 'turret-1-1',
                source: 'assets/turret-1-1.png'
            },
            {
                key: 'turret-1-2',
                source: 'assets/turret-1-2.png'
            },
            {
                key: 'turret-1-3',
                source: 'assets/turret-1-3.png'
            },
            {
                key: 'turret-2-1',
                source: 'assets/turret-2-1.png'
            },
            {
                key: 'turret-2-2',
                source: 'assets/turret-2-2.png'
            },
            {
                key: 'turret-2-3',
                source: 'assets/turret-2-3.png'
            },
            {
                key: 'turret-3-1',
                source: 'assets/turret-3-1.png'
            },
            {
                key: 'turret-3-2',
                source: 'assets/turret-3-2.png'
            },
            {
                key: 'turret-3-3',
                source: 'assets/turret-3-3.png'
            },
            {
                key: 'turret-4-1',
                source: 'assets/turret-4-1.png'
            },
            {
                key: 'turret-4-2',
                source: 'assets/turret-4-2.png'
            },
            {
                key: 'turret-4-3',
                source: 'assets/turret-4-3.png'
            },
            {
                key: 'turret-base',
                source: 'assets/turret-base.png'
            },
        ];

    function loadScripts(scripts, onComplete) {
        if (scripts.length > 0) {
            let entry = scripts[0];
            require(entry.scripts, function () {
                console.log(entry.message);
                if (entry.onComplete) {
                    entry.onComplete();
                }
                scripts.splice(0, 1);
                loadScripts(scripts, onComplete);
            });
        } else {
            onComplete();
        }
    }

    function loadAssets(assets, onSuccess, onError, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (assets.length > 0) {
            let entry = assets[0];
            loadAsset(entry.source,
                function (asset) {
                    onSuccess(entry, asset);
                    assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                },
                function (error) {
                    onError(error);
                    assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                });
        } else {
            onComplete();
        }
    }

    function loadAsset(source, onSuccess, onError) {
        let xhr = new XMLHttpRequest(),
            asset = null,
            fileExtension = source.substr(source.lastIndexOf('.') + 1);

        if (fileExtension) {
            xhr.open('GET', source, true);
            xhr.responseType = 'blob';

            xhr.onload = function () {
                if (xhr.status === 200) {
                    if (fileExtension === 'png' || fileExtension === 'jpg') {
                        asset = new Image();
                    } else if (fileExtension === 'mp3') {
                        asset = new Audio();
                    } else {
                        if (onError) { onError('Unknown file extension: ' + fileExtension); }
                    }
                    asset.onload = function () {
                        window.URL.revokeObjectURL(asset.src);
                    };
                    asset.src = window.URL.createObjectURL(xhr.response);
                    if (onSuccess) { onSuccess(asset); }
                } else {
                    if (onError) { onError('Failed to retrieve: ' + source); }
                }
            };
        } else {
            if (onError) { onError('Unknown file extension: ' + fileExtension); }
        }

        xhr.send();
    }

    function mainComplete() { Menu.menu.initialize() }

    loadAssets(assetOrder,
        function (source, asset) {    // Store it on success
            Master.assets[source.key] = asset;
        },
        function (error) {
            console.log(error);
        },
        function () {
            console.log('assets loaded');
            loadScripts(scriptOrder, mainComplete);
        }
    );

}());
