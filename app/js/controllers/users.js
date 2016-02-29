/* globals angular */
/**
 * Created by luizfilipe on 09/12/14.
 */

'use strict';

/**
 @name Users list
 @url #/users
 */

module.exports = [
  '$scope',
  '$rootScope',
  'rUser',
  function($scope, $rootScope, rUser) {
    $rootScope.showLoading = true;
    $scope.page = 1;
    $scope.waiting = false;
    $scope.end = false;
    $scope.selectUserToDelete = function (id) {
        $scope.$parent.delete_id = id;
        angular.element('#deleteModal').modal('show');
    };

    var user = new rUser();

    $scope.fetchUsers = function(reset) {
        if (reset === true) $scope.end = false;

        if ($scope.waiting === false && $scope.end === false)
        {
            // used when applying a filter
            if (reset === true)
            {
                $scope.page = 1;
                $rootScope.showLoading = true;
            }

            NProgress.start();
            $scope.waiting = true;

            user.fetchAll({
                page: $scope.page,
                search: $scope.q,
                infiniteScrolling: true,
                success: function(users) {
                    $scope.users = users;

                    $scope.page++;

                    // Hide loading
                    $rootScope.showLoading = false;
                    NProgress.done();
                    $scope.waiting = false;
                },
                infiniteScrollingSuccess: function(users, disable_infinite_scrolling) {
                    // Add each new user to the list
                    for (var i = 0; i < users.length; i++) {
                        $scope.users.push(users[i]);
                    };

                    $scope.page++;

                    if (disable_infinite_scrolling === true)
                    {
                        $scope.end = true;
                    }

                    // Hide loading
                    NProgress.done();
                    $scope.waiting = false;
                }
            });
        }
    };

    $scope.deleteUser = function() {
        NProgress.start();

        var user = new rUser($scope.delete_id);

        user.delete({
            success: function() {
                $scope.fetchUsers(true);
            }
        });
    };
}]