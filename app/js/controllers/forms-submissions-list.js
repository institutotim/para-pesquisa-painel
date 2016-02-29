/* globals angular */
/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';


/**
 @name List submissions from a form
 @url #/forms/edit/{id}/submissions
 */
module.exports = [
    '$scope',
    '$rootScope',
    '$compile',
    '$routeParams',
    'Forms',
    'rSubmissions',
    function($scope, $rootScope, $compile, $routeParams, Forms, rSubmissions) {
        var form_id = $routeParams.formId, user_id = $routeParams.userId;

        NProgress.start();
        $rootScope.showLoading = true;

        $scope.page = 1;
        $scope.waiting = false;
        $scope.end = false;
        $scope.identifier = null;
        $scope.form = null;
        $scope.user_id = null;
        $scope.status = null;
        $scope.period = null;
        $scope.enable_search_by_user = true;

        $scope.created_from = null;
        $scope.created_to = null;
        $scope.selectSubmissionToDelete = function (id) {
            $scope.$parent.delete_id = id;
            angular.element('#deleteModal').modal('show');
        };


        if (user_id !== undefined) {
            $scope.user_id = user_id;
        }

        $scope.applyDateFilter = function(period) {
            var created_from = null, created_to = null;
            $scope.custom_date_search = false;

            var update = function(created_from, created_to) {
                if (typeof created_from != 'undefined')
                {
                    $scope.created_from = created_from;
                }

                if (typeof created_to != 'undefined')
                {
                    $scope.created_to = created_to;
                }

                $scope.fetchSubmissions(true);
            };

            if (period == 'today')
            {
                created_from = new Date();
                created_from.setHours(0, 0, 0, 0); // midnight
                created_from = created_from.toISOString();

                // created_to not needed
                update(created_from, null);
            }

            if (period == 'this_week')
            {
                created_from = new Date();
                created_from.setHours(0, 0, 0, 0); // midnight
                created_from = new Date(created_from.setDate(created_from.getDate() - created_from.getDay())); // this week
                created_from = created_from.toISOString();

                // created_to not needed
                update(created_from, null);
            }

            if (period == 'this_month')
            {
                created_from = new Date();
                created_from.setHours(0, 0, 0, 0); // midnight
                created_from = new Date(created_from.getFullYear(), created_from.getMonth(), 1); // this month
                created_from = created_from.toISOString();

                // created_to not needed
                update(created_from, null);
            }

            if (period == 'this_year')
            {
                created_from = new Date();
                created_from.setHours(0, 0, 0, 0); // midnight
                created_from = new Date(created_from.getFullYear(), 0, 1); // this year :O
                created_from = created_from.toISOString();

                // created_to not needed
                update(created_from, null);
            }

            if (period == 'custom')
            {
                $scope.custom_date_search = true;

                // Set jQuery UI datepicker options
                $scope.dateOptions = {
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    dateFormat: 'dd/mm/yy',
                    onSelect: function(dateText) {
                        // Call save after selecting a date
                        update();

                        return;
                    }
                };
            }

            if (period == null)
            {
                update(null, null);
            }

            $scope.period = period;
        };

        $scope.applyStatusFilter = function(status) {
            $scope.status = status;
            $scope.fetchSubmissions(true);
        };

        $scope.deleteSubmission = function() {
            NProgress.start();

            var submission = new rSubmissions({id: $scope.delete_id});

            submission.delete({
                                  success: function() {
                                      $scope.fetchSubmissions(true);
                                  }
                              });
        };

        var submissions = new rSubmissions();

        $scope.fetchSubmissions = function(reset) {
            if (reset === true) $scope.end = false;

            if ($scope.waiting === false && $scope.end === false)
            {
                // used when applying a filter
                if (reset === true)
                {
                    $scope.page = 1;
                    $rootScope.showLoading = true;
                }

                // Get submission form
                if ($scope.form === null)
                {
                    Forms.get(form_id, function(data) {
                        $scope.form = data.response;

                        // Find identifier
                        for (var i = data.response.sections.length - 1; i >= 0; i--) {
                            for (var j = data.response.sections[i].fields.length - 1; j >= 0; j--) {
                                if (data.response.sections[i].fields[j].identifier == true)
                                {
                                    $scope.identifier = data.response.sections[i].fields[j].id;

                                    break;
                                }
                            };
                        };

                        $scope.fetchSubmissions();
                    }, function(err) {

                    });

                    return;
                }

                // Then get submissions
                NProgress.start();
                $scope.waiting = true;

                submissions.fetch({
                    form: form_id,
                    user: $scope.user_id,
                    page: $scope.page,
                    search: $scope.q,
                    status: $scope.status,
                    updated_between: [$scope.created_from, $scope.created_to],
                    infiniteScrolling: true,
                    success: function(submissions, count) {

                        // Then let's find which answer is for the identifier
                        for (var i = submissions.length - 1; i >= 0; i--) {
                            for (var j = submissions[i].answers.length - 1; j >= 0; j--) {
                                if (submissions[i].answers[j][0] == $scope.identifier) {
                                    submissions[i].identifier = submissions[i].answers[j][1];
                                }
                            };

                            if (typeof submissions[i].identifier == 'undefined') {
                                submissions[i].identifier = 'Submissão #' + submissions[i].id;
                            }
                        };

                        $scope.submissions = submissions;

                        $scope.page++;

                        $scope.count = count;

                        // Hide loading
                        $rootScope.showLoading = false;
                        NProgress.done();
                        $scope.waiting = false;
                    },
                    infiniteScrollingSuccess: function(submissions, disable_infinite_scrolling, count) {
                        // Then let's find which answer is for the identifier
                        for (var i = submissions.length - 1; i >= 0; i--) {
                            for (var j = submissions[i].answers.length - 1; j >= 0; j--) {
                                if (submissions[i].answers[j][0] == $scope.identifier) {
                                    submissions[i].identifier = submissions[i].answers[j][1];
                                }
                            };
                        }

                        // Add each new user to the list
                        for (var i = 0; i < submissions.length; i++) {
                            $scope.submissions.push(submissions[i]);
                        }

                        $scope.page++;

                        if (disable_infinite_scrolling === true) {
                            $scope.end = true;
                        }

                        $scope.count = count;

                        // Hide loading
                        NProgress.done();
                        $scope.waiting = false;
                    }
                });
            }
        };
    }
];