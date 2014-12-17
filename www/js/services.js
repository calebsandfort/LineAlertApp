var lineAlertAppServices = angular.module('lineAlertAppServices', ['ngResource']);

lineAlertAppServices.factory('LogMessageApiService', ['Restangular',
    function (Restangular) {
        return Restangular.service('LogMessageApi');
    }]);

lineAlertAppServices.factory('LogMessageService', ['$q', 'LogMessageApiService',
    function ($q, LogMessageApiService) {
        return {
            add: function (logMessage) {
                var q = $q.defer();

                LogMessageApiService.post(logMessage).then(function (id) {
                    q.resolve(id);
                }, function (e) {
                    q.reject(e);
                });

                return q.promise;
            }
        };
    }]);

lineAlertAppServices.factory('RefreshService', [
    function(){
        return {
            getLastMasterRefreshDate: function(){
                var lastMasterRefreshDate = null;
                var lastMasterRefreshDateString = window.localStorage['lineAlertApp.refresh.lastMasterRefreshDate'];

                if(lastMasterRefreshDateString) {
                    lastMasterRefreshDate = moment(angular.fromJson(lastMasterRefreshDateString));
                }

                return lastMasterRefreshDate;
            },
            setLastMasterRefreshDate: function(lastMasterRefreshDate){
                window.localStorage['lineAlertApp.refresh.lastMasterRefreshDate'] = angular.toJson(lastMasterRefreshDate);
            },
            getLastNbaRefreshDate: function(){
                var lastNbaRefreshDate = null;
                var lastNbaRefreshDateString = window.localStorage['lineAlertApp.refresh.lastNbaRefreshDate'];

                if(lastNbaRefreshDateString) {
                    lastNbaRefreshDate = moment(angular.fromJson(lastNbaRefreshDateString));
                }

                return lastNbaRefreshDate;
            },
            setLastNbaRefreshDate: function(lastNbaRefreshDate){
                window.localStorage['lineAlertApp.refresh.lastNbaRefreshDate'] = angular.toJson(lastNbaRefreshDate);
            },
            getLastNflRefreshDate: function(){
                var lastNflRefreshDate = null;
                var lastNflRefreshDateString = window.localStorage['lineAlertApp.refresh.lastNflRefreshDate'];

                if(lastNflRefreshDateString) {
                    lastNflRefreshDate = moment(angular.fromJson(lastNflRefreshDateString));
                }

                return lastNflRefreshDate;
            },
            setLastNflRefreshDate: function(lastNflRefreshDate){
                window.localStorage['lineAlertApp.refresh.lastNflRefreshDate'] = angular.toJson(lastNflRefreshDate);
            },
            getLastNhlRefreshDate: function(){
                var lastNhlRefreshDate = null;
                var lastNhlRefreshDateString = window.localStorage['lineAlertApp.refresh.lastNhlRefreshDate'];

                if(lastNhlRefreshDateString) {
                    lastNhlRefreshDate = moment(angular.fromJson(lastNhlRefreshDateString));
                }

                return lastNhlRefreshDate;
            },
            setLastNhlRefreshDate: function(lastNhlRefreshDate){
                window.localStorage['lineAlertApp.refresh.lastNhlRefreshDate'] = angular.toJson(lastNhlRefreshDate);
            }
        }
    }]);

lineAlertAppServices.factory('UserApiService', ['Restangular',
    function (Restangular) {
        return Restangular.service('UserApi');
    }]);

lineAlertAppServices.factory('UserService', ['$q', 'UserApiService',
    function ($q, UserApiService) {
        var userMaster = {};
        var userMasterSet = false;

        return {
            getLastRefreshDate: function(){
                var lastRefreshDate = null;
                var lastRefreshDateString = window.localStorage['lineAlertApp.user.lastRefreshDate'];

                if(lastRefreshDateString) {
                    lastRefreshDate = angular.fromJson(lastRefreshDateString);
                }

                return lastRefreshDate;
            },
            setLastRefreshDate: function(lastRefreshDate){
                window.localStorage['lineAlertApp.user.lastRefreshDate'] = angular.toJson(lastRefreshDate);
            },
            save: function(user){
                var q = $q.defer();
                UserApiService.post(user).then(function () {
                    userMaster = user;
                    window.localStorage['lineAlertApp.user'] = angular.toJson(userMaster);
                    q.resolve();
                }, function (e) {
                    //alert(JSON.stringify(e));
                    q.reject(e);
                });

                return q.promise;
            },
            register: function (user) {
                var q = $q.defer();

                var userString = window.localStorage['lineAlertApp.user'];
                var performPost = true;

                if(userString) {
                    var userFromStorage = angular.fromJson(userString);

                    if(user.pushId != userFromStorage.pushId){
                        user.identifier = userFromStorage.identifier;
                    }
                    else {
                        performPost = false;
                        q.resolve(userFromStorage.identifier);
                    }
                }

                if(performPost){
                    UserApiService.post(user).then(function (id) {
                        user.identifier = id;
                        window.localStorage['lineAlertApp.user'] = angular.toJson(user);
                        q.resolve(id);
                    }, function (e) {
                        q.reject(e);
                    });
                }

                return q.promise;
            },
            get: function(deviceId, refresh){
                var q = $q.defer();

                if(refresh){
                    userMasterSet = false;
                }

                var performGetUser = true;

                if(userMasterSet){
                    performGetUser = false;
                    q.resolve(userMaster);
                }

                if(!refresh && !userMasterSet) {
                    var userString = window.localStorage['lineAlertApp.user'];

                    if (userString) {
                        var userFromStorage = angular.fromJson(userString);

                        performGetUser = false;
                        userMaster = userFromStorage;
                        userMasterSet = true;
                        q.resolve(userMaster);
                    }
                }

                if(performGetUser){
                    UserApiService.one(deviceId).get().then(function(user){
                        userMaster = {
                            identifier: user.identifier,
                            added: user.added,
                            deviceId: user.deviceId,
                            pushId: user.pushId,
                            pushNotificationsAllowed: user.pushNotificationsAllowed,
                            bovadaLvPushNotificationsEnabled: user.bovadaLvPushNotificationsEnabled,
                            sportsBettingAgPushNotificationsEnabled: user.sportsBettingAgPushNotificationsEnabled,
                            fiveDimesEuPushNotificationsEnabled: user.fiveDimesEuPushNotificationsEnabled,
                            betOnlineAgPushNotificationsEnabled: user.betOnlineAgPushNotificationsEnabled,
                            favoriteSportsBook: user.favoriteSportsBook
                        }

                        window.localStorage['lineAlertApp.user'] = angular.toJson(userMaster);

                        userMasterSet = true

                        q.resolve(userMaster)
                    }, function(e){
                        q.reject(e);
                    });
                }

                return q.promise;
            }
        };
    }]);

lineAlertAppServices.factory('UserGameApiService', ['Restangular',
    function (Restangular) {
        return Restangular.service('UserGameApi');
    }]);

lineAlertAppServices.factory('UserGameService', ['$q', 'UserGameApiService', 'Restangular',
    function ($q, UserGameApiService, Restangular) {
        return {
            add: function (userGame) {
                var q = $q.defer();

                UserGameApiService.post(userGame).then(function (id) {
                    q.resolve(id);
                }, function (e) {
                    q.reject(e);
                });

                return q.promise;
            },
            remove: function(userIdentifier, gameIdentifier){
                var q = $q.defer();

                Restangular.all("UserGameApi").remove({userIdentifier: userIdentifier, gameIdentifier: gameIdentifier}).then(function(){
                    q.resolve();
                }, function (e) {
                    q.reject(e);
                });

                return q.promise;
            }
        };
    }]);

lineAlertAppServices.factory('NbaApiService', ['Restangular',
    function (Restangular) {
        return Restangular.service('NbaApi');
    }]);

lineAlertAppServices.factory('NbaService', ['$q', '$filter', 'NbaApiService', 'NbaTeams',
    function ($q, $filter, NbaApiService, NbaTeams) {
        var gamesMaster = new Array();
        var gamesMasterSet = false;

        return {
            applyPushUpdate: function(update){
                var game = $filter('filter')(weekMaster.games, {identifier: update.game.identifier});
                if(game.length > 0) {
                    game = game[0];

                    for (var i = 0; i < update.game.updates.length; i++) {
                        game[update.game.updates[i].lineName] = update.game.updates[i].line;
                    }

                    this.updateLocalStorage();
                }
            },
            updateLocalStorage: function(){
                window.localStorage['lineAlertApp.nbaGames'] = angular.toJson(gamesMaster);
            },
            getGame: function (identifier) {
                if(gamesMasterSet){

                    var game = $filter('filter')(gamesMaster, {identifier: identifier});
                    if(game.length > 0) {
                        return game[0];

                    }
                    else{
                        return null;
                    }
                }
                else{
                    return null;
                }
            },
            getGames: function (refresh, $ionicLoading) {
                var q = $q.defer();

                if(refresh){
                    gamesMasterSet = false;
                }

                var performGetList = true;

                if(gamesMasterSet){
                    performGetList = false;
                    q.resolve(gamesMaster);
                }

                if(!gamesMasterSet) {
                    var nbaGamesString = window.localStorage['lineAlertApp.nbaGames'];

                    if (nbaGamesString) {
                        var nbaGamesFromStorage = angular.fromJson(nbaGamesString);

                        gamesMaster = nbaGamesFromStorage;
                        gamesMasterSet = true;

                        if(!refresh) {
                            performGetList = false;
                            q.resolve(gamesMaster);
                        }
                    }
                }

                if(performGetList) {
                    $ionicLoading.show({
                        template: 'Loading...'
                    });

                    NbaApiService.getList().then(function (games) {
                        var currentHeaderDate = new Date("1/1/1990").getTime();
                        var sync = gamesMaster.length > 0;

                        for (var i = 0; i < games.length; i++) {
                            games[i].awayName = NbaTeams[games[i].awayIndex].name;
                            games[i].homeName = NbaTeams[games[i].homeIndex].name;
                            games[i].date = new Date(games[i].date);
                            games[i].showDateHeader = games[i].date.getTime() > currentHeaderDate;

                            if(sync){
                                var g = $filter('filter')(gamesMaster, {identifier: games[i].identifier});
                                if(g.length > 0){
                                    games[i].follow = g[0].follow;
                                }
                                else{
                                    games[i].follow = false;
                                }
                            }
                            else{
                                games[i].follow = false;
                            }

                            if (games[i].showDateHeader) {
                                currentHeaderDate = games[i].date.getTime()
                            }
                        }

                        window.localStorage['lineAlertApp.nbaGames'] = angular.toJson(games);

                        gamesMaster = games;
                        gamesMasterSet = true;

                        $ionicLoading.hide();
                        q.resolve(gamesMaster);
                    }, function (e) {
                        $ionicLoading.hide();
                        q.reject(e);
                    });
                }

                return q.promise;
            }
        };
    }]);

lineAlertAppServices.factory('NflApiService', ['Restangular',
    function (Restangular) {
        return Restangular.service('NflApi');
    }]);

lineAlertAppServices.factory('NflService', ['$q', '$filter', 'NflApiService', 'Restangular', 'NflTeams',
    function ($q, $filter, NflApiService, Restangular, NflTeams) {
        var weekMaster = {
            weekNumber: 0,
            games: new Array()
        };
        var weekMasterSet = false;

        return{
            applyPushUpdate: function(update){
                var game = $filter('filter')(weekMaster.games, {identifier: update.game.identifier});
                if(game.length > 0) {
                    game = game[0];

                    for (var i = 0; i < update.game.updates.length; i++) {
                        game[update.game.updates[i].lineName] = update.game.updates[i].line;
                    }

                    this.updateLocalStorage();
                }
            },
            updateLocalStorage: function(){
                window.localStorage['lineAlertApp.nflWeek'] = angular.toJson(weekMaster);
            },
            getGame: function (identifier) {
                if(weekMasterSet){

                    var game = $filter('filter')(weekMaster.games, {identifier: identifier});
                    if(game.length > 0) {
                        return game[0];

                    }
                    else{
                        return null;
                    }
                }
                else{
                    return null;
                }
            },
            getGames: function (refresh, $ionicLoading) {
                var q = $q.defer();

                if(refresh){
                    weekMasterSet = false;
                }

                var performGetList = true;

                if(weekMasterSet){
                    performGetList = false;
                    q.resolve(weekMaster);
                }

                if(!weekMasterSet) {
                    var nflWeekString = window.localStorage['lineAlertApp.nflWeek'];

                    if (nflWeekString) {
                        var nflWeekFromStorage = angular.fromJson(nflWeekString);

                        weekMaster = nflWeekFromStorage;
                        weekMasterSet = true;

                        if(!refresh) {
                            performGetList = false;
                            q.resolve(weekMaster);
                        }
                    }
                }

                if(performGetList) {
                    $ionicLoading.show({
                        template: 'Loading...'
                    });

                    Restangular.all("NflApi").customGET("Get", {}).then(function (data) {
                        var currentHeaderDate = new Date("1/1/1990").getTime();
                        var sync = weekMaster.games.length > 0;

                        for (var i = 0; i < data.games.length; i++) {
                            data.games[i].awayName = NflTeams[data.games[i].awayIndex].name;
                            data.games[i].homeName = NflTeams[data.games[i].homeIndex].name;
                            data.games[i].date = new Date(data.games[i].date);
                            data.games[i].showDateHeader = data.games[i].date.getTime() > currentHeaderDate;

                            if(sync){
                                var g = $filter('filter')(weekMaster.games, {identifier: data.games[i].identifier});
                                if(g.length > 0){
                                    data.games[i].follow = g[0].follow;
                                }
                                else{
                                    data.games[i].follow = false;
                                }
                            }
                            else{
                                data.games[i].follow = false;
                            }

                            if (data.games[i].showDateHeader) {
                                currentHeaderDate = data.games[i].date.getTime()
                            }
                        }

                        weekMaster.weekNumber = data.weekNumber;
                        weekMaster.games = data.games;

                        window.localStorage['lineAlertApp.nflWeek'] = angular.toJson(weekMaster);

                        weekMasterSet = true;

                        $ionicLoading.hide();
                        q.resolve(weekMaster);
                    }, function (e) {
                        $ionicLoading.hide();
                        q.reject(e);
                    });
                }

                return q.promise;
            }
        }
    }]);

lineAlertAppServices.factory('NhlApiService', ['Restangular',
    function (Restangular) {
        return Restangular.service('NhlApi');
    }]);

lineAlertAppServices.factory('NhlService', ['$q', '$filter', 'NhlApiService', 'NhlTeams',
    function ($q, $filter, NhlApiService, NhlTeams) {
        var gamesMaster = new Array();
        var gamesMasterSet = false;

        return {
            applyPushUpdate: function(update){
                var game = $filter('filter')(weekMaster.games, {identifier: update.game.identifier});
                if(game.length > 0) {
                    game = game[0];

                    for (var i = 0; i < update.game.updates.length; i++) {
                        game[update.game.updates[i].lineName] = update.game.updates[i].line;
                    }

                    this.updateLocalStorage();
                }
            },
            updateLocalStorage: function(){
                window.localStorage['lineAlertApp.nhlGames'] = angular.toJson(gamesMaster);
            },
            getGame: function (identifier) {
                if(gamesMasterSet){

                    var game = $filter('filter')(gamesMaster, {identifier: identifier});
                    if(game.length > 0) {
                        return game[0];

                    }
                    else{
                        return null;
                    }
                }
                else{
                    return null;
                }
            },
            getGames: function (refresh, $ionicLoading) {
                var q = $q.defer();

                if(refresh){
                    gamesMasterSet = false;
                }

                var performGetList = true;

                if(gamesMasterSet){
                    performGetList = false;
                    q.resolve(gamesMaster);
                }

                if(!gamesMasterSet) {
                    var nhlGamesString = window.localStorage['lineAlertApp.nhlGames'];

                    if (nhlGamesString) {
                        var nhlGamesFromStorage = angular.fromJson(nhlGamesString);

                        gamesMaster = nhlGamesFromStorage;
                        gamesMasterSet = true;

                        if(!refresh) {
                            performGetList = false;
                            q.resolve(gamesMaster);
                        }
                    }
                }

                if(performGetList) {
                    $ionicLoading.show({
                        template: 'Loading...'
                    });

                    NhlApiService.getList().then(function (games) {
                        var currentHeaderDate = new Date("1/1/1990").getTime();
                        var sync = gamesMaster.length > 0;

                        for (var i = 0; i < games.length; i++) {
                            games[i].awayName = NhlTeams[games[i].awayIndex].name;
                            games[i].homeName = NhlTeams[games[i].homeIndex].name;
                            games[i].date = new Date(games[i].date);
                            games[i].showDateHeader = games[i].date.getTime() > currentHeaderDate;

                            if(sync){
                                var g = $filter('filter')(gamesMaster, {identifier: games[i].identifier});
                                if(g.length > 0){
                                    games[i].follow = g[0].follow;
                                }
                                else{
                                    games[i].follow = false;
                                }
                            }
                            else{
                                games[i].follow = false;
                            }

                            if (games[i].showDateHeader) {
                                currentHeaderDate = games[i].date.getTime()
                            }
                        }

                        window.localStorage['lineAlertApp.nhlGames'] = angular.toJson(games);

                        gamesMaster = games;
                        gamesMasterSet = true;

                        $ionicLoading.hide();
                        q.resolve(gamesMaster);
                    }, function (e) {
                        $ionicLoading.hide();
                        q.reject(e);
                    });
                }

                return q.promise;
            }
        };
    }]);

lineAlertAppServices.factory('PushReceiverService', ["$cordovaPush",
    function ($cordovaPush) {
        return {
            register: function (senderId) {
                var androidConfig = {
                    "senderID": senderId
                };

                $cordovaPush.register(androidConfig).then(function(result) {
                }, function(err) {
                    alert(err)
                });
            }
        }
    }
]);
