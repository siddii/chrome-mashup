'use strict';

function GoogleAjaxFeedService($http) {
    this.getFeed = function(url){
        return $http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url), {cache: true});
    }
}
GoogleAjaxFeedService.$inject = ['$http'];

function FeedsService(GoogleAjaxFeedService, extensionURL, LocalStorageService) {
    function parseFeeds(res, baseURL) {
        var feedEntries = res.data.responseData.feed.entries;
        if (feedEntries.length > 0) {
            feedEntries.sort(function (feed1, feed2) {
                return new Date(feed1.publishedDate) > new Date(feed2.publishedDate);
            });
        }
        for (var i = 0; i < feedEntries.length; i++) {
            var feedElement = angular.element('<div>' + feedEntries[i].content + '</div>');
            feedElement.find('img').each(function (idx, imgNode) {
                imgNode.src = imgNode.src.replace('chrome-extension://', 'http://');
            });
            feedElement.find('a').each(function (idx, aNode) {
                aNode.target = "_new";
                aNode.href = aNode.href.replace('file:', 'http:');
                aNode.href = aNode.href.replace(extensionURL, baseURL);
            });
            feedEntries[i].content = feedElement.html();
        }
        return feedEntries;
    }

    this.loadFeeds = function (feedURL, baseURL) {
        var feedData = LocalStorageService.getCache(feedURL);
        if (feedData !== null) {
            return feedData;
        }
        return GoogleAjaxFeedService.getFeed(feedURL).then(function(res){
            var feedData = parseFeeds(res, baseURL);
            LocalStorageService.setCache(feedURL, feedData);
            return feedData;
        });
    };
}
FeedsService.$inject = ['GoogleAjaxFeedService', 'extensionURL', 'LocalStorageService'];

var selectedTabPrefKey = 'selectedTab';

function MashupController($scope, $http, FeedsService, LocalStorageService) {
    $scope.Feeds = {};
    $scope.FeedIndex = {};

    $scope.$watch(selectedTabPrefKey, function (newValue){
        LocalStorageService.setValue(selectedTabPrefKey, newValue);
    });


    $http.get('app.json').success(function (app){
        $scope.lang = app.defaultLang;
        $scope.tabs = app[$scope.lang].tabs;
        $scope.tabs.baseUrl = app[$scope.lang].baseUrl;
        if (app[$scope.lang].postRenderFunc) {
            var postRenderFunc = new Function("$scope", "$http", app[$scope.lang].postRenderFunc);
            postRenderFunc($scope, $http);
        }
        console.log('######### app[$scope.lang].postRender = ', app[$scope.lang].postRender);
        $scope.selectedTab = LocalStorageService.getValue(selectedTabPrefKey, $scope.tabs[0].id);
        var tab = $scope.tabs.filter(function (tab){return tab.id === $scope.selectedTab;})[0];
        $scope.loadTab(tab);
    });
    $scope.loadTab = function (tab){
        $scope.selectedTab = tab.id;
        if (!$scope.Feeds[tab.id]) {
            $scope.Feeds[tab.id] = FeedsService.loadFeeds(tab.feedUrl, $scope.tabs.baseUrl);
        }
    };
}

MashupController.$inject = ['$scope', '$http', 'FeedsService', 'LocalStorageService'];

function LocalStorageService () {
    var cacheTime = 1000 * 60 * 30; //30 min

    this.setCache = function (key, value) {
        localStorage[key] = JSON.stringify({date:new Date().getTime(), value:value});
    };

    this.getCache = function(key) {
        if (key in localStorage) {
            var object = JSON.parse(localStorage[key]);
            if ((new Date().getTime() - object.date) < cacheTime) {
                return object.value;
            }
        }
        return null;
    };

    this.setValue = function (key, value) {
        if (value) {
            localStorage[key] = value;
        }
    };

    this.getValue = function (key, defaultValue) {
        return (localStorage[key] !== undefined) ? localStorage[key] : defaultValue;
    }
}

var App = angular.module('Mashup', []);

App.service('FeedsService', FeedsService);
App.service('GoogleAjaxFeedService', GoogleAjaxFeedService);
App.service('LocalStorageService', LocalStorageService);

App.value('extensionURL', chrome.extension.getURL('/'));