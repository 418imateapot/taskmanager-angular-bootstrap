angular.module('spigoli', ['ngCookies'])
    .controller('todoCtrl', ['$scope', 'dataStore',
        function($scope, dataStore) {
            $scope.title = "Spigoli Task Manager";
            $scope.todos = dataStore.get('spigoli');
            $scope.newTask = { // new item buffer
                "name": "",
                "desc": ""
            };
            $scope.save = function() {
                // Save the buffar and update model and storage
                if ($scope.newTask.name === "") return;
                $scope.todos.push({
                    "name": $scope.newTask.name,
                    "desc": $scope.newTask.desc
                });
                // Save the todos using dataStore service
                dataStore.set('spigoli', $scope.todos);
                $scope.newTask = {};
            };
        }
    ])
    // This service encapsulates data storage for the app.
    // It uses localstorage if available, else uses cookies.
    // Provides get and set metods.
    .factory('dataStore', ['$cookies',
        function($cookies) {
            // Check if localStorage is available
            var storageAvailable = function(type) {
                try {
                    var storage = window[type],
                        x = '__storage_test__';
                    storage.setItem(x, x);
                    storage.removeItem(x);
                    return true;
                } catch (e) {
                    return false;
                }
            };

            if (storageAvailable('localStorage')) {
                // We can use localStorage
                return {
                    set: function(k, v) {
                        return localStorage.setItem(k, JSON.stringify(v));
                    },
                    get: function(k) {
                        var data = localStorage.getItem(k);
                        return (data === null) ? [] : JSON.parse(data);
                    }
                };
            } else {
                // Too bad, no localStorage for us
                // Use cookies instead
                return {
                    set: function(k, v) {
                        return $cookies.put(k, JSON.stringify(v));
                    },
                    get: function(k) {
                        var cookie = $cookies.get(k);
                        return (cookie === undefined) ? [] : JSON.parse(cookie);
                    }
                };
            }

        }
    ]);
