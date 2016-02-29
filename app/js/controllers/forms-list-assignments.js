/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';


module.exports = ['$scope', '$rootScope', '$routeParams', 'Assignment', 'rSubmissions', function($scope, $rootScope, $routeParams, Assignment, rSubmissions) {
    var form_id = $routeParams.formId;

    $rootScope.showLoading = true;
    $scope.page = 1;
    $scope.waiting = false;
    $scope.end = false;
    $scope.form_id = form_id;

    var assignment = new Assignment();

    $scope.fetchAssignments = function(reset) {
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

            assignment.fetchAll({
                page: $scope.page,
                form_id: form_id,
                infiniteScrolling: true,
                success: function(assignments) {
                    $scope.assignments = assignments;

                    $scope.page++;

                    // Hide loading
                    $rootScope.showLoading = false;
                    NProgress.done();
                    $scope.waiting = false;
                },
                infiniteScrollingSuccess: function(assignments, disable_infinite_scrolling) {
                    // Add each new user to the list
                    for (var i = 0; i < assignments.length; i++) {
                        $scope.assignments.push(assignments[i]);
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

    $scope.openTransferModal = function() {
        $('#transferModal').modal('show');
    };

    $scope.transferSubmissions = function(to, callback) {
        var submission = new rSubmissions({form_id: form_id});

        submission.transfer({
            from: $scope.transfer_info.id,
            to: to,
            success: function() {
                callback();
            }
        });

        callback();
    };
}]