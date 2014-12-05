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

lineAlertAppServices.factory('UserApiService', ['Restangular',
    function (Restangular) {
        return Restangular.service('UserApi');
    }]);

lineAlertAppServices.factory('UserService', ['$q', 'UserApiService',
    function ($q, UserApiService) {
        var userMaster = {};
        var userMasterSet = false;

        return {
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
            get: function(id){
                var q = $q.defer();

                UserApiService.one(id).get().then(function(user){
                    q.resolve(user)
                }, function(e){
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
            updateLocalStorage: function(){
                window.localStorage['lineAlertApp.nbaGames'] = angular.toJson(gamesMaster);
            },
            getGame: function (index) {
                if(gamesMasterSet){
                    return gamesMaster[index];
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

                if(!refresh && !gamesMasterSet) {
                    var nbaGamesString = window.localStorage['lineAlertApp.nbaGames'];

                    if (nbaGamesString) {
                        var nbaGamesFromStorage = angular.fromJson(nbaGamesString);

                        performGetList = false;
                        gamesMaster = nbaGamesFromStorage;
                        gamesMasterSet = true;
                        q.resolve(gamesMaster);
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
            updateLocalStorage: function(){
                window.localStorage['lineAlertApp.nflWeek'] = angular.toJson(weekMaster);
            },
            getGame: function (index) {
                if(weekMasterSet){
                    return weekMaster.games[index];
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

                if(!refresh && !weekMasterSet) {
                    var nflWeekString = window.localStorage['lineAlertApp.nflWeek'];

                    if (nflWeekString) {
                        var nflWeekFromStorage = angular.fromJson(nflWeekString);

                        performGetList = false;
                        weekMaster = nflWeekFromStorage;
                        weekMasterSet = true;
                        q.resolve(weekMaster);
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
                        q.reject(e);
                    });
                }

                return q.promise;
            }
        }
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
