chrome.browserAction.onClicked.addListener(gotoMainpage);

function gotoMainpage() {
    console.log('Going to inbox...');
    chrome.tabs.getAllInWindow(undefined, function (tabs) {
        for (var i = 0, tab; tab = tabs[i]; i++) {
            if (tab.url && tab.url === getMainUrl()) {
                chrome.tabs.update(tab.id, {selected: true});
                return;
            }
        }
        chrome.tabs.create({url: getMainUrl()});
    });
}

function getMainUrl() {
    return chrome.extension.getURL('index.html');
}



