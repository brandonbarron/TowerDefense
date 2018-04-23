Menu.screens['controls'] = (function (menu) {
    
    let that = {}, _upgradeKey, _sellKey, _nextKey, _gridKey, _distanceKey, uKey, sKey, nKey, gKey, dKey, array;

    that.initialize = function() {
        document.getElementById('id-controls-back').addEventListener(
            'click',
            function() {
                if (duplicate()) {
                    alert('Can\'t have duplicates');
                    return;
                }
                menu.showScreen('main-menu');
        });

        _upgradeKey = localStorage.getItem('TD.upgradeKey');
        _sellKey = localStorage.getItem('TD.sellKey');
        _nextKey = localStorage.getItem('TD.nextKey');
        _gridKey = localStorage.getItem('TD.gridKey');
        _distanceKey = localStorage.getItem('TD.distanceKey');
        
        if(_upgradeKey === null) localStorage.setItem('TD.upgradeKey','u');
        if(_sellKey === null) localStorage.setItem('TD.sellKey','s');
        if(_nextKey === null) localStorage.setItem('TD.nextKey','n');
        if(_gridKey === null) localStorage.setItem('TD.gridKey','g');
        if(_distanceKey === null) localStorage.setItem('TD.distanceKey','d');
        
        _upgradeKey = localStorage.getItem('TD.upgradeKey');
        _sellKey = localStorage.getItem('TD.sellKey');
        _nextKey = localStorage.getItem('TD.nextKey');
        _gridKey = localStorage.getItem('TD.gridKey');
        _distanceKey = localStorage.getItem('TD.distanceKey');
        
        document.getElementById('upgrade-key').value = _upgradeKey;
        document.getElementById('sell-key').value = _sellKey;
        document.getElementById('next-key').value = _nextKey;
        document.getElementById('grid-key').value = _gridKey;
        document.getElementById('distance-key').value = _distanceKey;
    }

    that.run = function() { 
        if (duplicate()) return;
        uKey = document.getElementById('upgrade-key').value.toLowerCase();
        sKey = document.getElementById('sell-key').value.toLowerCase();
        nKey = document.getElementById('next-key').value.toLowerCase();
        gKey = document.getElementById('grid-key').value.toLowerCase();
        dKey = document.getElementById('distance-key').value.toLowerCase();
        document.getElementById('upgrade-key').value = uKey;
        document.getElementById('sell-key').value = sKey;
        document.getElementById('next-key').value = nKey;
        document.getElementById('grid-key').value = gKey;
        document.getElementById('distance-key').value = dKey;
        localStorage.setItem('TD.upgradeKey', uKey);
        localStorage.setItem('TD.sellKey', sKey);
        localStorage.setItem('TD.nextKey', nKey);    
        localStorage.setItem('TD.gridKey', gKey);
        localStorage.setItem('TD.distanceKey', dKey);  
    }

    function duplicate() {
        array = [];
        array.push(document.getElementById('upgrade-key').value.toLowerCase());
        array.push(document.getElementById('sell-key').value.toLowerCase());
        array.push(document.getElementById('next-key').value.toLowerCase());
        array.push(document.getElementById('grid-key').value.toLowerCase());
        array.push(document.getElementById('distance-key').value.toLowerCase());
        for (let i = 0; i < array.length; i++)
            for (let j = 0; j < array.length; j++) {
                if (i !== j && array[i] === array[j]) return true;
            }
        return false;
    }

    return that;
}(Menu.menu));