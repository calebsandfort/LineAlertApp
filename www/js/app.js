// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('lineAlertApp', ['ionic', 'angularMoment', 'lineAlertAppServices', 'lineAlertAppControllers',
    'lineAlertAppFilters', 'ngCordova.plugins.push', 'ngCordova.plugins.device', 'restangular'])
    .config(function($stateProvider, $urlRouterProvider, RestangularProvider) {
        $stateProvider
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
            })

        $urlRouterProvider.otherwise("/nfl");

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
