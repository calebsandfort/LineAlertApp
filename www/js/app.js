// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('lineAlertApp', ['ionic', 'angularMoment', 'lineAlertAppServices', 'lineAlertAppControllers',
    'lineAlertAppFilters', 'ngCordova.plugins.push', 'ngCordova.plugins.device', 'restangular'])
    .constant("LeaguesEnum",
    {
        NBA: 1,
        NFL: 2
    })
    .constant("NbaTeams",
    [
        {identifier: 11, name: "Atlanta Hawks"},
        {identifier: 1, name: "Boston Celtics"},
        {identifier: 2, name: "Brooklyn Nets"},
        {identifier: 12, name: "Charlotte Bobcats"},
        {identifier: 6, name: "Chicago Bulls"},
        {identifier: 7, name: "Cleveland Cavaliers"},
        {identifier: 16, name: "Dallas Mavericks"},
        {identifier: 21, name: "Denver Nuggets"},
        {identifier: 8, name: "Detroit Pistons"},
        {identifier: 26, name: "Golden State Warriors"},
        {identifier: 17, name: "Houston Rockets"},
        {identifier: 9, name: "Indiana Pacers"},
        {identifier: 27, name: "Los Angeles Clippers"},
        {identifier: 28, name: "Los Angeles Lakers"},
        {identifier: 18, name: "Memphis Grizzlies"},
        {identifier: 13, name: "Miami Heat"},
        {identifier: 10, name: "Milwaukee Bucks"},
        {identifier: 22, name: "Minnesota Timberloves"},
        {identifier: 19, name: "New Orleans Pelicans"},
        {identifier: 3, name: "New York Knicks"},
        {identifier: 24, name: "Oklahoma City Thunder"},
        {identifier: 14, name: "Orlando Magic"},
        {identifier: 4, name: "Philadelphia 76ers"},
        {identifier: 29, name: "Phoenix Suns"},
        {identifier: 23, name: "Portland Trail Blazers"},
        {identifier: 30, name: "Sacramento Kings"},
        {identifier: 20, name: "San Antonio Spurs"},
        {identifier: 5, name: "Toronto Raptors"},
        {identifier: 25, name: "Utah Jazz"},
        {identifier: 15, name: "Washington Wizards"}
    ])
    .constant("NflTeams",
    [
        {identifier: 59, name: "Arizona Cardinals"},
        {identifier: 55, name: "Atlanta Falcons"},
        {identifier: 35, name: "Baltimore Ravens"},
        {identifier: 31, name: "Buffalo Bills"},
        {identifier: 56, name: "Carolina Panthers"},
        {identifier: 51, name: "Chicago Bears"},
        {identifier: 36, name: "Cincinnati Bengals"},
        {identifier: 37, name: "Cleveland Browns"},
        {identifier: 47, name: "Dallas Cowboys"},
        {identifier: 43, name: "Denver Broncos"},
        {identifier: 52, name: "Detroit Lions"},
        {identifier: 53, name: "Green Bay Packers"},
        {identifier: 39, name: "Houston Texans"},
        {identifier: 40, name: "Indianapolis Colts"},
        {identifier: 41, name: "Jacksonville Jaguars"},
        {identifier: 44, name: "Kansas City Chiefs"},
        {identifier: 32, name: "Miami Dolphins"},
        {identifier: 54, name: "Minnesota Vikings"},
        {identifier: 33, name: "New England Patriots"},
        {identifier: 57, name: "New Orleans Saints"},
        {identifier: 48, name: "New York Giants"},
        {identifier: 34, name: "New York Jets"},
        {identifier: 45, name: "Oakland Raiders"},
        {identifier: 49, name: "Philadelphia Eagles"},
        {identifier: 38, name: "Pittsburgh Steelers"},
        {identifier: 46, name: "San Diego Chargers"},
        {identifier: 61, name: "San Francisco 49ers"},
        {identifier: 62, name: "Seattle Seahawks"},
        {identifier: 60, name: "St. Louis Rams"},
        {identifier: 58, name: "Tampa Bay Buccaneers"},
        {identifier: 42, name: "Tennessee Titans"},
        {identifier: 50, name: "Washington Redskins"}
    ])
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
                    game: function($stateParams, NbaService, LeaguesEnum) {
                        var g = NbaService.getGame($stateParams.index);
                        g.league = LeaguesEnum.NBA;
                        return g;
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
                    game: function($stateParams, NflService, LeaguesEnum) {
                        var g = NflService.getGame($stateParams.index);
                        g.league = LeaguesEnum.NFL;
                        return g;
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
