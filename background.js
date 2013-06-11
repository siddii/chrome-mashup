chrome.browserAction.onClicked.addListener(gotoMainpage);

function gotoMainpage() {
    console.log('Going to inbox...');
    chrome.tabs.getAllInWindow(undefined, function(tabs) {
        for (var i = 0, tab; tab = tabs[i]; i++) {
            if (tab.url && tab.url === getMainUrl()) {
                console.log('Found Gmail tab: ' + tab.url + '. ' +
                    'Focusing and refreshing count...');
                chrome.tabs.update(tab.id, {selected: true});
                //startRequest({scheduleRequest:false, showLoadingAnimation:false});
                return;
            }
        }
        console.log('Could not find Gmail tab. Creating one...');
        chrome.tabs.create({url: getMainUrl()});
    });
}

function getMainUrl() {
    return chrome.extension.getURL('index.html');
}



