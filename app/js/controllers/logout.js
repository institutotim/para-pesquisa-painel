/**
 * Created by luizfilipe on 09/12/14.
 */

'use strict';

/**
 @name Logout user
 @url #/user/logout
 */

module.exports = [
    '$location',
    '$rootScope',
    'Auth',
    function($location, $rootScope, Auth) {
        Auth.logout(function() {
            $rootScope.showLogin = true;
            $location.path('/');
        });
    }
];