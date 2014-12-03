// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('lineAlertApp', ['ionic', 'angularMoment', 'lineAlertAppServices', 'lineAlertAppControllers',
    'lineAlertAppFilters', 'ngCordova.plugins.push', 'ngCordova.plugins.device', 'restangular'])
    .config(function($stateProvider, $urlRouterProvider, RestangularProvider) {
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/main.html"
            })
            .state('app.nba', {
                abstract: true,
                url: "/nba",
                views: {
                    'mainContent' :{
                        template: '<ion-nav-view></ion-nav-view>'
                    }
                }
            })
            .state('app.nba.games', {
                url: "",
                templateUrl: "partials/nba.html",
                controller: "nbaController"
            })
            .state('app.nba.game', {
                url: "/:index",
                templateUrl: "partials/game.html",
                controller: "gameController",
                resolve: {
                    game: function($stateParams, NbaService) {
                        return NbaService.getGame($stateParams.index)
                    }
                }
            })
            .state('app.nfl', {
                abstract: true,
                url: "/nfl",
                views: {
                    'mainContent' :{
                        template: '<ion-nav-view></ion-nav-view>'
                    }
                }
            })
            .state('app.nfl.games', {
                url: "",
                templateUrl: "partials/nfl.html",
                controller: "nflController"
            })
            .state('app.nfl.game', {
                url: "/:index",
                templateUrl: "partials/game.html",
                controller: "gameController",
                resolve: {
                    game: function($stateParams, NflService) {
                        return NflService.getGame($stateParams.index)
                    }
                }
            })

        $urlRouterProvider.otherwise("/app/nba");

        /*$stateProvider
            .state('landing', {
                url: '/landing',
                templateUrl: "partials/landing.html",
                controller: "landingController"
            })
            .state('nfl', {
                url: '/nfl',
                templateUrl: "partials/nfl.html",
                controller: "nflDynamicController"
            })
            .state('nba', {
                url: '/nba',
                templateUrl: "partials/nba.html",
                controller: "nbaController"
            });

        $urlRouterProvider.otherwise("/nfl");*/

        RestangularProvider.setBaseUrl('http://guerillalogistics.com/LineAlertApp/api');
    })
    .run(function ($ionicPlatform, PushReceiverService, $cordovaDevice) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if(typeof (window.plugins) != "undefined" && typeof (window.plugins.pushNotification) != "undefined" && window.plugins.pushNotification){
                PushReceiverService.register("822489992888");
            }

            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
