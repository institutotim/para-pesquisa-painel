/**
 * Created by luizfilipe on 09/12/14.
 */

'use strict';


/**
 @name Login page
 @url #/
 */
module.exports = [
    '$http',
    '$scope',
    '$rootScope',
    '$location',
    'API',
    'Auth',
    '$translatePartialLoader',
    function($http, $scope, $rootScope, $location, API, Auth,
             translatePartialLoader) {

        //translatePartialLoader.addPart('login');

        $rootScope.showLogin = true;

        $scope.login = function() {
            NProgress.start();

            Auth.login({
                    username: $scope.username,
                    password: $scope.password
                },
                function() {
                    NProgress.done();
                    $rootScope.showLogin = false;
                    $location.path('/dashboard');
                },
                function() {
                    NProgress.done();
                    $scope.loginError = true;
                });
        };

    }
];