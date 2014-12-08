var lineAlertAppControllers = angular.module('lineAlertAppControllers', []);

lineAlertAppControllers.controller('globalController', function ($scope, $filter, $location, $ionicSideMenuDelegate, $cordovaDevice, UserService, LogMessageService, SportsBooks) {
        $scope.user = {};

        $scope.toggleSideMenu = function() {
                $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.isActive = function(route) {
                return  $location.path().indexOf(route) > -1;
        };

        $scope.$on('pushNotificationReceived', function(event, notification) {

                switch (notification.event) {
                        case 'registered':
                                if (notification.regid.length > 0 && notification.regid != $scope.user.pushId) {
                                        if($scope.user.pushId == ''){
                                                $scope.user.pushNotificationsAllowed = true;
                                                $scope.user.bovadaLvPushNotificationsEnabled = true;
                                        }

                                        $scope.user.pushId = notification.regid;
                                        UserService.save($scope.user).then(function(){

                                        },
                                        function(e){

                                        });
                                }
                                break;
                        case 'message':
                                $scope.$broadcast('lineUpdateReceived', {
                                        gameId: notification.payload.gameId,
                                        bovadaLvLine: notification.payload.bovadaLvLine
                                });
                                break;
                        default :
                                var logMessage = {message: JSON.stringify(notification)};

                                LogMessageService.add(logMessage).then(function (id) {
                                            //alert("You've successfully registered; your id is " + id);
                                    },
                                    function (e) {
                                            //alert("Error: " + JSON.stringify(e));
                                    });

                                //alert(logMessage.message);
                                break;
                }
        });

        $scope.$on('userUpdated', function(event, u) {
                $scope.user = u;
                //$scope.$apply();
        });

        $scope.showGameOverUnder = function(g){
                var overUnder = -1000;

                switch ($scope.user.favoriteSportsBook){
                        case  SportsBooks.BovadaLv.value:
                                overUnder = g.bovadaLvOverUnder;
                                break;
                        case  SportsBooks.SportsBettingAg.value:
                                overUnder = g.sportsBettingAgOverUnder;
                                break;
                        case  SportsBooks.FiveDimesEu.value:
                                overUnder = g.fiveDimesEuOverUnder;
                                break;
                        case  SportsBooks.BetOnlineAg.value:
                                overUnder = g.betOnlineAgOverUnder;
                                break;
                }

                return overUnder > -1000;
        }

        $scope.getGameOverUnder = function(g){
                var overUnder = -1000;

                switch ($scope.user.favoriteSportsBook){
                        case  SportsBooks.BovadaLv.value:
                                overUnder = g.bovadaLvOverUnder;
                        break;
                        case  SportsBooks.SportsBettingAg.value:
                                overUnder = g.sportsBettingAgOverUnder;
                        break;
                        case  SportsBooks.FiveDimesEu.value:
                                overUnder = g.fiveDimesEuOverUnder;
                        break;
                        case  SportsBooks.BetOnlineAg.value:
                                overUnder = g.betOnlineAgOverUnder;
                        break;
                }

                return overUnder;
        }

        $scope.showGameLine = function(g){
                var line = -1000;

                switch ($scope.user.favoriteSportsBook){
                        case  SportsBooks.BovadaLv.value:
                                line = g.bovadaLvLine;
                                break;
                        case  SportsBooks.SportsBettingAg.value:
                                line = g.sportsBettingAgLine;
                                break;
                        case  SportsBooks.FiveDimesEu.value:
                                line = g.fiveDimesEuLine;
                                break;
                        case  SportsBooks.BetOnlineAg.value:
                                line = g.betOnlineAgLine;
                                break;
                }

                return line > -1000;
        }

        $scope.getGameLine = function(g){
                var line = -1000;

                switch ($scope.user.favoriteSportsBook){
                        case  SportsBooks.BovadaLv.value:
                                line = g.bovadaLvLine;
                                break;
                        case  SportsBooks.SportsBettingAg.value:
                                line = g.sportsBettingAgLine;
                                break;
                        case  SportsBooks.FiveDimesEu.value:
                                line = g.fiveDimesEuLine;
                                break;
                        case  SportsBooks.BetOnlineAg.value:
                                line = g.betOnlineAgLine;
                                break;
                }

                return $filter("line")(line);
        }
});

lineAlertAppControllers.controller('landingController', function ($scope, $location) {

});

lineAlertAppControllers.controller('nbaController', function ($scope, $filter, $ionicLoading, NbaService) {
        $scope.games = new Array();

        NbaService.getGames(false, $ionicLoading).then(function (games) {
                    $scope.games = games;
            },
            function (e) {
                    alert("Error: " + JSON.stringify(e));
            });

        $scope.getTeamName = function(index){
                return $scope.teams[index].name;
        }

        $scope.refreshGames = function(){
                NbaService.getGames(true, $ionicLoading).then(function (games) {
                            $scope.games = games;
                    },
                    function (e) {
                            alert("Error: " + JSON.stringify(e));
                    });
        }
});

lineAlertAppControllers.controller('nflController', function ($scope, $filter, $ionicLoading, NflService) {
        $scope.teams = new Array();
        $scope.currentWeek = {};

        NflService.getGames(false, $ionicLoading).then(function (week) {
                    $scope.week = week;
            },
            function (e) {
                    alert("Error: " + JSON.stringify(e));
            });

        $scope.getTeamName = function(index){
                return $scope.teams[index].name;
        }

        $scope.$on('lineUpdateReceived', function(event, update) {
                var game = $filter('filter')($scope.currentWeek.games, {identifier: update.gameId});
                if(game.length > 0){
                        game = game[0];
                        game.bovadaLvLine = update.bovadaLvLine;
                        $scope.$apply();
                }
        });

        $scope.refreshGames = function(){
                NflService.getGames(true, $ionicLoading).then(function (week) {
                            $scope.week = week;
                    },
                    function (e) {
                            alert("Error: " + JSON.stringify(e));
                    });
        }

        /*$scope.filterTest = function(){
                var game = $filter('filter')($scope.currentWeek.games, {identifier: 162});
                if(game.length > 0){
                        game = game[0];
                }
                alert(game.identifier);
        }*/

        /*$scope.$on('pushNotificationReceived', function(event, notification) {
                alert(angular.fromJson(notification));
        });*/
});

lineAlertAppControllers.controller('gameController', function ($scope, $ionicNavBarDelegate, NbaService, NflService, LeaguesEnum, game) {
        $scope.game = game;

        $scope.goBack = function(){
                switch (game.league){
                        case LeaguesEnum.NBA:
                                NbaService.updateLocalStorage();
                                break;
                        case LeaguesEnum.NFL:
                                NflService.updateLocalStorage();
                                break;
                }

                $ionicNavBarDelegate.back();
        }
});

lineAlertAppControllers.controller('preferencesController', function ($scope, $ionicNavBarDelegate, UserService) {
        $scope.pushNotificationsAllowedChange = function(){
                if(!$scope.user.pushNotificationsAllowed){
                        $scope.user.bovadaLvPushNotificationsEnabled =
                        $scope.user.sportsBettingAgPushNotificationsEnabled =
                        $scope.user.fiveDimesEuPushNotificationsEnabled =
                        $scope.user.betOnlineAgPushNotificationsEnabled = false;
                }
        }

        $scope.goBack = function(){
                $scope.user.favoriteSportsBook = parseInt($scope.user.favoriteSportsBook);
                UserService.save($scope.user).then(function(){

                    },
                    function(e){

                    });
                $ionicNavBarDelegate.back();
        }
});