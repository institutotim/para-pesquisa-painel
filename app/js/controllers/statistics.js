/**
 * Created by luizfilipe on 09/12/14.
 */

'use strict';

/**
 @name Statistics
 @url #/dashboard
 */

module.exports = [
    '$rootScope',
    '$routeParams',
    '$scope',
    'Statistics',
    function($rootScope, $routeParams, $scope, Statistics) {
        var form_id = $routeParams.formId,
            user_id = $routeParams.userId,
            page = 'global';

        // Let's set page based on routeParams
        if (typeof form_id !== 'undefined' && typeof user_id !== 'undefined')
        {
            page = 'form_user';
        }
        else if (typeof form_id !== 'undefined')
        {
            page = 'form';
        }
        else if (typeof user_id !== 'undefined')
        {
            page = 'user';
        }

        NProgress.start();
        $rootScope.showLoading = true;

        var options = {
            success: function(data) {

                $scope.waiting_approval = data.waiting_approval;
                $scope.waiting_correction = data.waiting_correction;
                $scope.approved = data.approved;
                $scope.canceled = data.canceled;
                $scope.rescheduled = data.rescheduled;

                var extra_data = [
                    {
                        name: 'TOTAL_ANSWERS',
                        count: data.total,
                    },

                    {
                        name: 'TOTAL_COMPLETED_ANSWERS',
                        count: data.total_filled,
                    },

                    {
                        name: 'TOTAL_NOT_STARTED_ANSWERS',
                        count: data.pending
                    },

                    {
                        name: 'TOTAL_SURVEYS',
                        count: data.form_count,
                    },

                    {
                        name: 'TOTAL_USERS',
                        count: data.user_count,
                    }
                ];

                $scope.user_name = null;
                $scope.form_name = null;

                if (page == 'form_user')
                {
                    $scope.title = 'FROM_USER_WITH_SURVEY';

                    $scope.user_name = data.user.name;
                    $scope.form_name = data.form.name;
                }
                else if (page == 'form')
                {
                    $scope.title = 'FROM_SURVEY';

                    $scope.form_name = data.form.name;
                }
                else if (page == 'user')
                {
                    $scope.title = 'FROM_USER';
                    
                    $scope.user_name = data.user.name;
                }
                else
                {
                    $scope.title = 'GLOBAL_STATISTICS';
                }

                // Now we organize the "extra data"
                $scope.available_colors = ['', 'color2', 'color3', 'color4'];
                $scope.infos = [];
                var next_available_color = 0;

                for (var i = extra_data.length - 1; i >= 0; i--) {
                    if (typeof extra_data[i].count != 'undefined')
                    {
                        var obj = {
                            name: extra_data[i].name,
                            count: extra_data[i].count,
                            color: next_available_color
                        };

                        next_available_color++;

                        $scope.infos.push(obj);
                    }
                };

                // percentage
                var sizes = {
                    approved_size: (parseInt(data.approved) / parseInt(data.total_filled)) * 100,
                    waiting_approval_size: (parseInt(data.waiting_approval) / parseInt(data.total_filled)) * 100,
                    waiting_correction_size: (parseInt(data.waiting_correction) / parseInt(data.total_filled)) * 100,
                    reschdule_size: (parseInt(data.rescheduled) / parseInt(data.total_filled)) * 100,
                    canceled_size: (parseInt(data.canceled) / parseInt(data.total_filled)) * 100
                };

                for (var x in sizes) {
                    if (sizes[x] < 15)
                    {
                        sizes[x] = 20;
                    }
                    else
                    {
                        sizes[x] = sizes[x] * 2;
                    }

                    if (sizes[x] >= 100)
                    {
                        sizes[x] = 90;
                    }
                };

                var objects = [
                    {
                        name: 'approved',
                        size: sizes.approved_size,
                        pos: (100 - sizes.approved_size) / 2
                    },

                    {
                        name: 'waiting_approval',
                        size: sizes.waiting_approval_size,
                        pos: (100 - sizes.waiting_approval_size) / 2
                    },

                    {
                        name: 'waiting_correction',
                        size: sizes.waiting_correction_size,
                        pos: (100 - sizes.waiting_correction_size) / 2
                    },

                    {
                        name: 'reschdule',
                        size: sizes.reschdule_size,
                        pos: (100 - sizes.reschdule_size) / 2
                    },

                    {
                        name: 'canceled',
                        size: sizes.canceled_size,
                        pos: (100 - sizes.canceled_size) / 2
                    },
                ];

                // Change graph's size

                for (var i = objects.length - 1; i >= 0; i--) {
                    $('.chart.' + objects[i].name + ' .inner').css({
                        width: objects[i].size,
                        height: objects[i].size,
                        top: objects[i].pos,
                        left: objects[i].pos
                    });
                };

                NProgress.done();
                $rootScope.showLoading = false;
            }
        };

        if (page == 'form_user')
        {
            var stats = new Statistics({ form_id: form_id, user_id: user_id });

            stats.fetchFormUser(options);
        }
        else if (page == 'form')
        {
            var stats = new Statistics({ form_id: form_id });

            stats.fetchForm(options);
        }
        else if (page == 'user')
        {
            var stats = new Statistics({ user_id: user_id });

            stats.fetchUser(options);
        }
        else
        {
            var stats = new Statistics();

            stats.fetchGlobal(options);
        }
    }
];