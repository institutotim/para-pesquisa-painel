/**
 * Created by luizfilipe on 09/12/14.
 */

'use strict';

/**
 @name List exports
 @url #/exports
 */


module.exports = [
    '$scope',
    '$rootScope',
    'Forms',
    'Exports',
    function($scope, $rootScope, Forms, Exports) {
        $scope.form_id = null;
        $scope.status = null;
        $scope.period = null;
        $scope.created_from = null;
        $scope.created_to = null;
        $scope.method = null;
        $scope.forms = null;
        $scope.include_header = true;
        $scope.progress = null;
        $scope.job_id = null;

        $scope.changeMethod = function (m) {
            $scope.method = m;
        };

        var _export = new Exports(), was_running = false;

        var update = function(was_run) {
            if (typeof was_run != 'undefined')
            {
                was_running = was_run;
            }

            _export.fetch({
                success: function(data) {
                    $scope.last_answers_export = data.last_answers_export;
                    $scope.last_users_export = data.last_users_export;
                    $scope.last_forms_export = data.last_forms_export;
                    $scope.last_fields_export = data.last_fields_export;
                    $scope.last_submissions_export = data.last_submissions_export;

                    $scope.job_id = data.running_job_id;

                    if ($scope.forms == null)
                    {
                        Forms.getAll(function(data) {
                            $scope.forms = data.response;
                        }, function(err) {

                        });
                    }

                    // Hide loading
                    $rootScope.showLoading = false;
                    NProgress.done();

                    if ($scope.job_id == null)
                    {
                        if (was_running != false)
                        {
                            _export.getProgress({
                                job_id: was_running,
                                success: function(data) {
                                    $scope.progress = data;
                                }
                            });

                            was_running = false;
                        }
                    }
                    else
                    {
                        _export.getProgress({
                            job_id: $scope.job_id,
                            success: function(data) {
                                $scope.progress = data;
                                was_running = $scope.job_id;

                                setTimeout(function() {
                                    update();
                                    console.log('wow');
                                }, 6000);
                            },
                            error: function() {
                                update();
                                NProgress.done();
                            }
                        });
                    }
                }
            });
        };

        // Start this shit!
        NProgress.start();
        $rootScope.showLoading = true;
        update();
        $scope.update = update;

        $scope.selectDateFilter = function(period) {
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

            $scope.period = period;
        };

        $scope.selectStatusFilter = function(status) {
            $scope.status = status;
        };

        $scope.export = function() {
            $scope.progress = null;

            var options = {method: $scope.method, include_header: $scope.include_header};

            // answers, users, forms, fields, submissions
            switch ($scope.method)
            {
                case 'users':
                    options.role = $scope.role;
                    break;

                case 'submissions':
                    options.form_id = $scope.form_id;
                    options.updated_between = [$scope.created_from, $scope.created_to];
                    options.status = $scope.status;

                    if (options.form_id == null)
                    {
                        alert('Por favor, selecione um formulário.');
                        return;
                    }
                    break;

                case 'answers':
                    options.form_id = $scope.form_id;
                    options.updated_between = [$scope.created_from, $scope.created_to];
                    options.status = $scope.status;

                    if (options.form_id == null)
                    {
                        alert('Por favor, selecione um formulário.');
                        return;
                    }
                    break;
            }

            options.success = function(job_id) {
                $scope.job_id = job_id;
                update(job_id);
            };

            options.error = function() {
                alert('Houve um erro ao iniciar a exportação. Provavelmente o sistema já está trabalhando na exportação de algum outro arquivo. Tente novamente.');
            };

            _export.create(options);
        };
    }
];