var lineAlertAppControllers = angular.module('lineAlertAppControllers', []);

lineAlertAppControllers.controller('globalController', function ($scope, $location, $ionicSideMenuDelegate, $cordovaDevice, UserService, LogMessageService) {
        $scope.toggleSideMenu = function() {
                $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.isActive = function(route) {
                return route === $location.path();
        };

        $scope.$on('pushNotificationReceived', function(event, notification) {

                switch (notification.event) {
                        case 'registered':
                                if (notification.regid.length > 0) {
                                        UserService.register({
                                                deviceId: $cordovaDevice.getUUID(),
                                                pushId: notification.regid
                                        }).then(function (id) {
                                                    alert("You've successfully registered; your id is " + id);
                                            },
                                            function (e) {
                                                    alert("Error: " + JSON.stringify(e));
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
});

lineAlertAppControllers.controller('landingController', function ($scope, $location) {

});

lineAlertAppControllers.controller('nbaController', function ($scope, $filter, NbaService) {
        $scope.teams = new Array();
        $scope.games = new Array();

        //region Teams
        $scope.teams.push({identifier: 11, name: "Atlanta Hawks"});
        $scope.teams.push({identifier: 1, name: "Boston Celtics"});
        $scope.teams.push({identifier: 2, name: "Brooklyn Nets"});
        $scope.teams.push({identifier: 12, name: "Charlotte Bobcats"});
        $scope.teams.push({identifier: 6, name: "Chicago Bulls"});
        $scope.teams.push({identifier: 7, name: "Cleveland Cavaliers"});
        $scope.teams.push({identifier: 16, name: "Dallas Mavericks"});
        $scope.teams.push({identifier: 21, name: "Denver Nuggets"});
        $scope.teams.push({identifier: 8, name: "Detroit Pistons"});
        $scope.teams.push({identifier: 26, name: "Golden State Warriors"});
        $scope.teams.push({identifier: 17, name: "Houston Rockets"});
        $scope.teams.push({identifier: 9, name: "Indiana Pacers"});
        $scope.teams.push({identifier: 27, name: "Los Angeles Clippers"});
        $scope.teams.push({identifier: 28, name: "Los Angeles Lakers"});
        $scope.teams.push({identifier: 18, name: "Memphis Grizzlies"});
        $scope.teams.push({identifier: 13, name: "Miami Heat"});
        $scope.teams.push({identifier: 10, name: "Milwaukee Bucks"});
        $scope.teams.push({identifier: 22, name: "Minnesota Timberwolves"});
        $scope.teams.push({identifier: 19, name: "New Orleans Pelicans"});
        $scope.teams.push({identifier: 3, name: "New York Knicks"});
        $scope.teams.push({identifier: 24, name: "Oklahoma City Thunder"});
        $scope.teams.push({identifier: 14, name: "Orlando Magic"});
        $scope.teams.push({identifier: 4, name: "Philadelphia 76ers"});
        $scope.teams.push({identifier: 29, name: "Phoenix Suns"});
        $scope.teams.push({identifier: 23, name: "Portland Trail Blazers"});
        $scope.teams.push({identifier: 30, name: "Sacramento Kings"});
        $scope.teams.push({identifier: 20, name: "San Antonio Spurs"});
        $scope.teams.push({identifier: 5, name: "Toronto Raptors"});
        $scope.teams.push({identifier: 25, name: "Utah Jazz"});
        $scope.teams.push({identifier: 15, name: "Washington Wizards"});
        //endregion

        NbaService.getGames($scope.teams).then(function (games) {
                    $scope.games = games;
            },
            function (e) {
                    alert("Error: " + JSON.stringify(e));
            });

        $scope.getTeamName = function(index){
                return $scope.teams[index].name;
        }
});

lineAlertAppControllers.controller('gameController', function ($scope, game) {
        $scope.game = game;
});

lineAlertAppControllers.controller('nflDynamicController', function ($scope, $filter, NflService) {
        $scope.teams = new Array();
        $scope.currentWeek = {};

        //region Scripted Data
        //region Teams
        $scope.teams.push({identifier: 59, name: "Arizona Cardinals"});
        $scope.teams.push({identifier: 55, name: "Atlanta Falcons"});
        $scope.teams.push({identifier: 35, name: "Baltimore Ravens"});
        $scope.teams.push({identifier: 31, name: "Buffalo Bills"});
        $scope.teams.push({identifier: 56, name: "Carolina Panthers"});
        $scope.teams.push({identifier: 51, name: "Chicago Bears"});
        $scope.teams.push({identifier: 36, name: "Cincinnati Bengals"});
        $scope.teams.push({identifier: 37, name: "Cleveland Browns"});
        $scope.teams.push({identifier: 47, name: "Dallas Cowboys"});
        $scope.teams.push({identifier: 43, name: "Denver Broncos"});
        $scope.teams.push({identifier: 52, name: "Detroit Lions"});
        $scope.teams.push({identifier: 53, name: "Green Bay Packers"});
        $scope.teams.push({identifier: 39, name: "Houston Texans"});
        $scope.teams.push({identifier: 40, name: "Indianapolis Colts"});
        $scope.teams.push({identifier: 41, name: "Jacksonville Jaguars"});
        $scope.teams.push({identifier: 44, name: "Kansas City Chiefs"});
        $scope.teams.push({identifier: 32, name: "Miami Dolphins"});
        $scope.teams.push({identifier: 54, name: "Minnesota Vikings"});
        $scope.teams.push({identifier: 33, name: "New England Patriots"});
        $scope.teams.push({identifier: 57, name: "New Orleans Saints"});
        $scope.teams.push({identifier: 48, name: "New York Giants"});
        $scope.teams.push({identifier: 34, name: "New York Jets"});
        $scope.teams.push({identifier: 45, name: "Oakland Raiders"});
        $scope.teams.push({identifier: 49, name: "Philadelphia Eagles"});
        $scope.teams.push({identifier: 38, name: "Pittsburgh Steelers"});
        $scope.teams.push({identifier: 46, name: "San Diego Chargers"});
        $scope.teams.push({identifier: 61, name: "San Francisco 49ers"});
        $scope.teams.push({identifier: 62, name: "Seattle Seahawks"});
        $scope.teams.push({identifier: 60, name: "St. Louis Rams"});
        $scope.teams.push({identifier: 58, name: "Tampa Bay Buccaneers"});
        $scope.teams.push({identifier: 42, name: "Tennessee Titans"});
        $scope.teams.push({identifier: 50, name: "Washington Redskins"});
        //endregion
        //endregion

        $scope.currentWeek = NflService.getCurrentNflWeek();

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
