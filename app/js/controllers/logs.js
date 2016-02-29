/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';


/**
 @name List logs
 @url #/logs
 */
module.exports = ['$rootScope', '$scope', '$compile', 'Logs', 'API', function($rootScope, $scope, $compile, Logs, API) {

    var search_by_user_popover = $('#search_by_user_popover').html(), popover = $('.by_user');

    popover.popover({
        html: true,
        placement: 'bottom',
        title: 'Filtrar por usuário',
        content: search_by_user_popover
    });

    popover.on('shown.bs.popover', function () {
        var e = popover.next('.popover').find('.popover-content').html(search_by_user_popover);

        // Autocomplete for adding users
        $('#search_by_user').autocomplete({
            source: function( request, response ) {

                API('GET', '/users?name_like=' + request.term + '&by_role=agent,mod').success(function(data, status, headers) {
                    response( $.map( data.response, function( item ) {
                        return {
                            label: item.name,
                            value: item.name,
                            user: item
                        }
                    }));
                }).error(function() {

                });
            },

            open: function(){
                $(this).autocomplete('widget').css('z-index', 2000);
                return false;
            },

            select: function (event, ui) {
                $(this).val(ui.item.user.name);

                $scope.user_id = ui.item.user.id;

                $scope.fetchLogs(true);

                return false;
            }
        });

        $compile(e)($scope);
        $scope.$apply();
    });

    var logs = new Logs();

    NProgress.start();
    $rootScope.showLoading = true;

    $scope.page = 1;
    $scope.waiting = false;
    $scope.end = false;

    $scope.period = null;

    $scope.created_from = null;
    $scope.created_to = null;

    $scope.applyDateFilter = function(period) {
        var created_from = null, created_to = null;

        if (period == 'today')
        {
            created_from = new Date();
            created_from.setHours(0, 0, 0, 0); // midnight
            created_from = created_from.toISOString();

            // created_to not needed
        }

        if (period == 'this_week')
        {
            created_from = new Date();
            created_from.setHours(0, 0, 0, 0); // midnight
            created_from = new Date(created_from.setDate(created_from.getDate() - created_from.getDay())); // this week
            created_from = created_from.toISOString();

            // created_to not needed
        }

        if (period == 'this_month')
        {
            created_from = new Date();
            created_from.setHours(0, 0, 0, 0); // midnight
            created_from = new Date(created_from.getFullYear(), created_from.getMonth(), 1); // this month
            created_from = created_from.toISOString();

            // created_to not needed
        }

        if (period == 'this_year')
        {
            created_from = new Date();
            created_from.setHours(0, 0, 0, 0); // midnight
            created_from = new Date(created_from.getFullYear(), 0, 1); // this year :O
            created_from = created_from.toISOString();

            // created_to not needed
        }

        $scope.created_from = created_from;
        $scope.created_to = created_to;
        $scope.period = period;
        $scope.fetchLogs(true);
    };

    $scope.fetchLogs = function(reset) {
        if (reset === true) $scope.end = false;

        if ($scope.waiting === false && $scope.end === false)
        {
            // used when applying a filter
            if (reset === true)
            {
                $scope.page = 1;
                $rootScope.showLoading = true;
            }

            // Then get submissions
            NProgress.start();
            $scope.waiting = true;

            logs.fetchAll({
                page: $scope.page,
                user: $scope.user_id,
                //search: $scope.q,
                updated_between: [$scope.created_from, $scope.created_to],
                infiniteScrolling: true,
                success: function(logs, count) {
                    $scope.logs = logs;
                    $scope.count = count;

                    $scope.page++;

                    // Hide loading
                    $scope.waiting = false;
                    $rootScope.showLoading = false;
                    NProgress.done();
                },
                infiniteScrollingSuccess: function(logs, count, disable_infinite_scrolling) {
                    // Add each new user to the list
                    for (var i = 0; i < logs.length; i++) {
                        $scope.logs.push(logs[i]);
                    };

                    $scope.page++;

                    if (disable_infinite_scrolling === true)
                    {
                        $scope.end = true;
                    }

                    $scope.count += count;

                    // Hide loading
                    NProgress.done();
                    $scope.waiting = false;
                }
            });
        }
    };

}];