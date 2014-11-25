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

lineAlertAppServices.factory('NbaService', ['$q', 'NbaApiService',
    function ($q, NbaApiService) {
        return {
            getGames: function () {
                var q = $q.defer();

                var nbaGamesString = window.localStorage['lineAlertApp.nbaGames'];
                var performGetList = true;

                if(nbaGamesString) {
                    var nbaGamesFromStorage = angular.fromJson(userString);

                    performGetList = false;
                    q.resolve(nbaGamesFromStorage);
                }

                if(performGetList) {
                    NbaApiService.getList().then(function (games) {
                        var currentHeaderDate = new Date("1/1/1990").getTime();
                        for (var i = 0; i < games.length; i++) {
                            games[i].date = new Date(games[i].date);
                            games[i].showDateHeader = games[i].date.getTime() > currentHeaderDate;
                            if (games[i].showDateHeader) {
                                currentHeaderDate = games[i].date.getTime()
                            }
                        }

                        window.localStorage['lineAlertApp.nbaGames'] = angular.toJson(games);

                        q.resolve(games);
                    }, function (e) {
                        q.reject(e);
                    });
                }

                return q.promise;
            }
        };
    }]);

lineAlertAppServices.factory('NflApiService', ['$resource',
    function ($resource) {
        return $resource('http://guerillalogistics.com/LineAlertApp/api/NflApi', {}, {
            getCurrentNflWeek: {method: 'GET', params: {currentNflWeek: true}, isArray: false}
        });
    }]);

lineAlertAppServices.factory('NflService', ['NflApiService',
    function (NflApiService) {
        return{
            getCurrentNflWeek: function(){
                var nflSettingsString = window.localStorage['lineAlertApp.nflSettings'];
                var nflSettings;
                var getFromApi = false;
                var day = moment().day();
                var saveToStorage = false;

                if(nflSettingsString){
                    nflSettings = angular.fromJson(nflSettingsString);

                    if(day == 2 && !nflSettings.tuesdayResetPerformed){
                        nflSettings.tuesdayResetPerformed = true;
                        getFromApi = true;
                    }
                    else if(day != 2 && nflSettings.tuesdayResetPerformed){
                        nflSettings.tuesdayResetPerformed = false;
                        saveToStorage = true;
                    }
                }
                else{
                    nflSettings = {tuesdayResetPerformed: day == 2};
                    getFromApi = true;
                }

                if(getFromApi){
                    return NflApiService.getCurrentNflWeek(function (data) {
                        var currentHeaderDate = new Date("1/1/1990").getTime();

                        for (var i = 0; i < data.games.length; i++) {
                            data.games[i].date = new Date(data.games[i].date);
                            data.games[i].showDateHeader = data.games[i].date.getTime() > currentHeaderDate;
                            if (data.games[i].showDateHeader) {
                                currentHeaderDate = data.games[i].date.getTime()
                            }
                        }

                        nflSettings.currentWeek = {
                            weekNumber: data.weekNumber,
                            games: data.games
                        }

                        window.localStorage['lineAlertApp.nflSettings'] = angular.toJson(nflSettings);
                    }, function(e){
                        alert("NFL Error: " + JSON.stringify(e));
                    });
                }
                else{
                    if(saveToStorage){
                        window.localStorage['lineAlertApp.nflSettings'] = angular.toJson(nflSettings);
                    }

                    return nflSettings.currentWeek;
                }
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
