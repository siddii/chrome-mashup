'use strict';

var Mashup = angular.module('Mashup', []);

var selectedFeed = 'selectedFeed';

function MashupController($scope, $http, FeedsService, LocalStorageService) {
    $scope.Feeds = {};
    $scope.FeedIndex = {};

    $http.get('app.json').success(function (app){
        $scope.app = app;


        var selectedFeed = $scope.app.feeds.filter(function (feed){return feed.title === $scope.selectedFeed.title;})[0];
        $scope.loadFeed(selectedFeed);
    });


    $scope.$watch(selectedFeed, function (newValue){
        LocalStorageService.setValue(selectedFeed, newValue);
    });


    $scope.loadFeed = function (feed){
        $scope.selectedFeed = feed;

        $http.get(feed.url).success(function (feed){
            if (!$scope.Feeds[feed.id]) {
                $scope.Feeds[feed.id] = FeedsService.loadFeeds(feed.feedUrl, $scope.tabs.baseUrl);
            }
        });
    };
}

MashupController.$inject = ['$scope', '$http', 'FeedsService', 'LocalStorageService'];

Mashup.value('extensionURL', chrome.extension.getURL('/'));