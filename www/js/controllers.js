var lineAlertAppControllers = angular.module('lineAlertAppControllers', []);

lineAlertAppControllers.controller('globalController', function ($scope, $filter, $location, $state,
                                                                 $ionicSideMenuDelegate,
                                                                 $cordovaDevice, $cordovaToast,
                                                                 UserService, LogMessageService, NbaService, NflService,
                                                                 SportsBooks, LeaguesEnum) {
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
                                var listState = "";
                                var gameState = "";

                                switch (notification.payload.game.league) {
                                        case  LeaguesEnum.NBA.value:
                                                listState = "app.nba.games";
                                                gameState = "app.nba.game";
                                                break;
                                        case  LeaguesEnum.NFL.value:
                                                listState = "app.nfl.games";
                                                gameState = "app.nfl.game";
                                                break;
                                }

                                var appShowing = typeof (notification.foreground) != "undefined" && notification.foreground;

                                //Open
                                if(appShowing && ($state.$current.name == listState || $state.$current.name == gameState)){
                                        $scope.$broadcast('lineUpdateReceived', notification.payload, true);
                                }
                                else if(appShowing){
                                        $cordovaToast.showLongCenter(notification.payload.message);

                                        switch (notification.payload.game.league) {
                                                case  LeaguesEnum.NBA.value:
                                                        NbaService.applyPushUpdate(notification.payload);
                                                        break;
                                                case  LeaguesEnum.NFL.value:
                                                        NflService.applyPushUpdate(notification.payload);
                                                        break;
                                        }
                                }
                                else if($state.$current.name == listState || $state.$current.name == gameState){
                                        $scope.$broadcast('lineUpdateReceived', notification.payload, false);
                                }
                                else{

                                }

                                //$state.go(notification.payload.state);
                                //alert($state.$current.name);


                                //$state.go(notification.payload.state);
                                //$scope.$broadcast('globalLineUpdateReceived', notification.payload);
                                break;
                        default :
                                var logMessage = {message: JSON.stringify(notification)};

                                LogMessageService.add(logMessage).then(function (id) {
                                            //alert("You've successfully registered; your id is " + id);
                                    },
                                    function (e) {
                                            //alert("Error: " + JSON.stringify(e));
                                    });
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

lineAlertAppControllers.controller('nbaController', function ($scope, $filter, $cordovaToast, $ionicLoading, NbaService, RefreshService) {
        $scope.games = new Array();

        var refresh = false;
        var lastMasterRefreshDate = RefreshService.getLastMasterRefreshDate();
        var lastNbaRefreshDate = RefreshService.getLastNbaRefreshDate();

        if(lastMasterRefreshDate && lastNbaRefreshDate && lastNbaRefreshDate.diff(lastMasterRefreshDate) < 0){
                RefreshService.setLastNbaRefreshDate(lastMasterRefreshDate);
                refresh = true;
        }

        NbaService.getGames(refresh, $ionicLoading).then(function (games) {
                    $scope.games = games;
            },
            function (e) {
                    //alert("Error: " + JSON.stringify(e));
            });

        $scope.getTeamName = function(index){
                return $scope.teams[index].name;
        }

        $scope.refreshGames = function(applyScope){
                NbaService.getGames(true, $ionicLoading).then(function (games) {
                            $scope.games = games;
                            RefreshService.setLastNbaRefreshDate(RefreshService.getLastMasterRefreshDate());
                            if(applyScope){
                                    $scope.$apply();
                            }
                    },
                    function (e) {
                            //alert("Error: " + JSON.stringify(e));
                    });
        }

        $scope.$on("refreshGames", function(event){
                $scope.refreshGames(false);
        });

        $scope.$on('lineUpdateReceived', function(event, update, showToast) {
                var game = $filter('filter')($scope.games, {identifier: update.game.identifier});
                if(game.length > 0){
                        game = game[0];

                        for(var i = 0; i < update.game.updates.length; i++){
                                game[update.game.updates[i].lineName] = update.game.updates[i].line;
                        }

                        $scope.$apply();
                        NbaService.updateLocalStorage();

                        if(showToast) {
                                $cordovaToast.showLongCenter(update.message);
                        }
                }
        });
});

lineAlertAppControllers.controller('nflController', function ($scope, $state, $cordovaToast, $filter, $ionicLoading, NflService, RefreshService) {
        $scope.teams = new Array();
        $scope.currentWeek = {};

        var lastMasterRefreshDate = RefreshService.getLastMasterRefreshDate();
        var lastNflRefreshDate = RefreshService.getLastNflRefreshDate();
        var refresh = false;

        if(lastMasterRefreshDate && lastNflRefreshDate && lastNflRefreshDate.diff(lastMasterRefreshDate) < 0){
                RefreshService.setLastNflRefreshDate(lastMasterRefreshDate);
                refresh = true;
        }

        NflService.getGames(refresh, $ionicLoading).then(function (week) {
                    $scope.week = week;
            },
            function (e) {
                    //alert("Error: " + JSON.stringify(e));
            });

        $scope.getTeamName = function(index){
                return $scope.teams[index].name;
        }

        $scope.refreshGames = function(applyScope){
                NflService.getGames(true, $ionicLoading).then(function (week) {
                            $scope.week = week;
                            RefreshService.setLastNflRefreshDate(RefreshService.getLastMasterRefreshDate());
                            if(applyScope){
                                $scope.$apply();
                            }
                    },
                    function (e) {
                            //alert("Error: " + JSON.stringify(e));
                    });
        }

        $scope.$on("refreshGames", function(event){
                $scope.refreshGames(false);
        });

        $scope.$on('lineUpdateReceived', function(event, update, showToast) {
                var game = $filter('filter')($scope.week.games, {identifier: update.game.identifier});
                if(game.length > 0){
                        game = game[0];

                        for(var i = 0; i < update.game.updates.length; i++){
                                game[update.game.updates[i].lineName] = update.game.updates[i].line;
                        }

                        $scope.$apply();
                        NflService.updateLocalStorage();

                        if(showToast) {
                                $cordovaToast.showLongCenter(update.message);
                        }
                }
        });
});

lineAlertAppControllers.controller('gameController', function ($scope, $state, $cordovaToast, $ionicNavBarDelegate, NbaService, NflService, LeaguesEnum, game) {
        $scope.game = game;

        $scope.goBack = function(){
                switch (game.league){
                        case LeaguesEnum.NBA.value:
                                NbaService.updateLocalStorage();
                                break;
                        case LeaguesEnum.NFL.value:
                                NflService.updateLocalStorage();
                                break;
                }

                $ionicNavBarDelegate.back();
        }

        $scope.$on('lineUpdateReceived', function(event, update, showToast) {
                if(update.game.identifier == $scope.game.identifier) {
                        for (var i = 0; i < update.game.updates.length; i++) {
                                $scope.game[update.game.updates[i].lineName] = update.game.updates[i].line;
                        }

                        $scope.$apply();
                }

                if(showToast){
                        $cordovaToast.showLongCenter(update.message);
                }
        });

        /*$scope.fireEvent = function(){

                var u = {};
                u.game = {
                        identifier: 1439,
                        updates: new Array()
                };
                u.game.updates.push({lineName: "fiveDimesEuLine", line: -5});

                $scope.$broadcast('lineUpdateReceived', u);
        }*/
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