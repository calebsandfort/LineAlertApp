angular.module('ngCordova.plugins.device', [])

  .factory('$cordovaDevice', [function () {

    return {
      getDevice: function () {
        return device;
      },

      getCordova: function () {
        return device.cordova;
      },

      getModel: function () {
        return device.model;
      },

      // Warning: device.name is deprecated as of version 2.3.0. Use device.model instead.
      getName: function () {
        return device.name;
      },

      getPlatform: function () {
        return device.platform;
      },

      getUUID: function () {
        return device.uuid;
      },

      getVersion: function () {
        return device.version;
      },

      deviceExists: function(){
        return typeof (device) != "undefined";
      }
    };
  }]);

angular.module('ngCordova.plugins.push', [])

  .factory('$cordovaPush', ['$q', '$window', '$rootScope', function ($q, $window, $rootScope) {
    return {
      onNotification: function(notification) {
        $rootScope.$broadcast('pushNotificationReceived', notification);
      },

      register: function (config) {

        var q = $q.defer();
        if (config !== undefined && config.ecb === undefined) {
          config.ecb = "angular.element(document.querySelector('[ng-app]')).injector().get('$cordovaPush').onNotification";
        }

        $window.plugins.pushNotification.register(
          function (result) {
            q.resolve(result);
          },
          function (error) {
            q.reject(error);
          },
          config);

        return q.promise;
      },

      unregister: function (options) {
        var q = $q.defer();
        $window.plugins.pushNotification.unregister(
          function (result) {
            q.resolve(result);
          },
          function (error) {
            q.reject(error);
          },
          options);

        return q.promise;
      },

      // iOS only
      setBadgeNumber: function (number) {
        var q = $q.defer();
        $window.plugins.pushNotification.setApplicationIconBadgeNumber(
          function (result) {
            q.resolve(result);
          },
          function (error) {
            q.reject(error);
          },
          number);
        return q.promise;
      }
    };
  }]);

angular.module('ngCordova.plugins.toast', [])

    .factory('$cordovaToast', ['$q', '$window', function ($q, $window) {

      return {
        showShortTop: function (message) {
          var q = $q.defer();
          $window.plugins.toast.showShortTop(message, function (response) {
            q.resolve(response);
          }, function (error) {
            q.reject(error);
          });
          return q.promise;
        },

        showShortCenter: function (message) {
          var q = $q.defer();
          $window.plugins.toast.showShortCenter(message, function (response) {
            q.resolve(response);
          }, function (error) {
            q.reject(error);
          });
          return q.promise;
        },

        showShortBottom: function (message) {
          var q = $q.defer();
          $window.plugins.toast.showShortBottom(message, function (response) {
            q.resolve(response);
          }, function (error) {
            q.reject(error);
          });
          return q.promise;
        },

        showLongTop: function (message) {
          var q = $q.defer();
          $window.plugins.toast.showLongTop(message, function (response) {
            q.resolve(response);
          }, function (error) {
            q.reject(error);
          });
          return q.promise;
        },

        showLongCenter: function (message) {
          var q = $q.defer();
          $window.plugins.toast.showLongCenter(message, function (response) {
            q.resolve(response);
          }, function (error) {
            q.reject(error);
          });
          return q.promise;
        },

        showLongBottom: function (message) {
          var q = $q.defer();
          $window.plugins.toast.showLongBottom(message, function (response) {
            q.resolve(response);
          }, function (error) {
            q.reject(error);
          });
          return q.promise;
        },


        show: function (message, duration, position) {
          var q = $q.defer();
          $window.plugins.toast.show(message, duration, position, function (response) {
            q.resolve(response);
          }, function (error) {
            q.reject(error);
          });
          return q.promise;
        }
      };

    }]);

