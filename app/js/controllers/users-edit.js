/* globals angular, NProgress, $ */
/**
 * Created by luizfilipe on 09/12/14.
 */

'use strict';

/**
 @name Edit or add user
 @url #/users/(edit|create)/{id?}
 */

module.exports = [
    '$q',
    '$scope',
    '$rootScope',
    '$routeParams',
    '$http',
    '$cookieStore',
    'Users',
    'apiInfo',
    function(q, $scope, $rootScope, $routeParams, $http, $cookieStore, Users,
             apiInfo) {

        var id = $routeParams.userId, updating = true;

        if (id === undefined) {
            updating = false;
        }

        $scope.available_roles = [
            {name: 'ROLE_COORDINATOR', value: 'mod'},
            {name: 'ROLE_RESEARCHER', value: 'agent'},
            {name: 'ROLE_ADMINISTRATOR', value: 'api'}];
        $scope.user = {};
        $scope.updating = updating;

        if (updating === true) {
            $rootScope.showLoading = true;
            NProgress.start();

            Users.get(id, function(data) {
                // Hide loading
                $rootScope.showLoading = false;
                NProgress.done();

                $scope.user = data.response;
            }, function(err) {

            });
        }

        var uploadFile = function (file, userId) {
            var url = [
                apiInfo.url,
                apiInfo.version,
                'users',
                userId ,
                'avatar'
            ];
            return $http.uploadFile({
                url: url.join('/'),
                method: 'POST',
                headers: { 'X-Session-ID': $cookieStore.get('session_id') },
                data: {'avatar': file}
            });
        };

        var holdFiles = function (files) {
            $scope.files = files;
        };

        var readFileAndRender = function (file) {
            var reader = new FileReader();
            reader.onload = function (ev) {
                $('#avatar_edit').
                    css('background-image', 'url(' + ev.target.result + ')');
            };
            reader.readAsDataURL(file);
        };

        $scope.onFileSelect = function($files) {
            NProgress.start();

            if (!updating) {
                holdFiles($files);
            }

            function doneUpdating(data) {
                NProgress.done();
                $('#avatar_edit').
                    css('background-image',
                    'url(' + data.data.response.avatar + ')');
            }

            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                if (updating) {
                    uploadFile(file, id).then(doneUpdating);
                } else {
                    readFileAndRender(file);
                    NProgress.done();
                }
            }
        };

        $scope.send = function() {
            var formattedObj = {
                'name' : $scope.user.name,
                'username' : $scope.user.username,
                'role' : $scope.user.role,
                'email' : $scope.user.email
            };

            if (updating === false)
            {
                formattedObj.password = $scope.user.password;

                Users.create(formattedObj, function(data) {
                    id = $scope.user.id = data.response.user_id;
                    if ($scope.files) {
                        var promises = [];
                        angular.forEach($scope.files, function(file) {
                            promises.push(uploadFile(file, id));
                        });
                        q.all([promises]).then(function () {
                            $scope.showMessage = 'success';
                        });
                    } else {
                        $scope.showMessage = 'success';
                    }
                }, function() {
                    $scope.showMessage = 'error';
                });
            } else {
                if ($scope.user.password !== undefined) {
                    formattedObj.password = $scope.user.password;
                }

                Users.update(id, formattedObj, function() {
                    $scope.showMessage = 'success';
                }, function() {
                    $scope.showMessage = 'error';
                });
            }
        };
    }
];