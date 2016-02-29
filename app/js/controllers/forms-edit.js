/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

/**
 @name Create or edit form
 @url #/users/(edit|create)/{id?}
 */
module.exports = [
    '$rootScope',
    '$routeParams',
    '$scope',
    '$timeout',
    'Forms',
    'API',
    'apiInfo',
    '$http',
    '$cookieStore',
    '$filter',
    function($rootScope, $routeParams, $scope, $timeout, Forms, API, apiInfo, $http, $cookieStore, $filter) {
        var id = $routeParams.formId, updating = true;

        // LION KING HEEEEEEEEEEEAAAAAAAAAAAAAAAAAAAAA
        var form = {
            id: null,
            name: null,
            subtitle: null,
            pub_start: null,
            pub_end: null,
            max_reschedules: 0,
            restricted_to_users: false,
            allow_transfer: true,
            requires_approval: false

            /*stop_reasons: [],
             users: [],
             sections: []*/
        };

        if (typeof id === "undefined")
        {
            updating = false;
        }
        else
        {
            form.id = id;
        }

        var assignments = [];

        $scope.updateForm = function() {
            NProgress.start();

            var loadedForms = false, loadedAssignments = false;

            Forms.get(form.id, function(data) {
                // Hide loading
                $rootScope.showLoading = false;
                NProgress.done();

                form = data.response;
                $scope.form = form;

                // Now let's make inputs "available"
                if (form.pub_start !== null)
                {
                    $scope.publishing = true;
                }

                if (form.pub_end !== null)
                {
                    $scope.end = true;
                }

            }, function(err) {

            });

            Forms.get_all_assignments(form.id, function(data) {
                assignments = data.response;
                $scope.assignments = assignments;
            }, function(err) {

            });
        };

        // Get form if is editing
        if (updating === true)
        {
            $rootScope.showLoading = true;
            $scope.updateForm();
        }

        var pages = ['page_one', 'page_two', 'page_three', 'page_four'], current_page = 0;

        var tabs = ['DEFAULT_TAB', 'SPECIAL_TAB'],
            current_tab = 0,
            tab_items = [
                [
                    {type: 'TextField'},
                    {type: 'DatetimeField'},
                    {type: 'RadioField'},
                    {type: 'CheckboxField'},
                    {type: 'PrivateField'},
                    {type: 'NumberField'},
                    {type: 'OrderedlistField'},
                    {type: 'SelectField'}
                ],

                [
                    {type: 'CpfField'},
                    {type: 'EmailField'},
                    {type: 'UrlField'},
                    {type: 'LabelField'},
                    {type: 'DinheiroField'}
                ]
            ];

        $scope.form = form;
        $scope.assignments = assignments;
        $scope.current_page = pages[current_page];

        // Set jQuery UI datepicker options
        $scope.dateOptions = {
            showOtherMonths: true,
            selectOtherMonths: true,
            dateFormat: 'dd/mm/yy',
            onSelect: function(dateText) {
                // Call save after selecting a date
                $scope.saveForm();
            }
        };

        // pass default "reason" for rescheduling
        $scope.reasonReschedule = 'true';

        // do not show .csv headers options before uploading file
        $scope.showImportOptions = false;
        $scope.showImportLog = false;

        // tabs
        $scope.current_tab = current_tab;
        $scope.tabs = tabs;
        $scope.tab_items = tab_items;

        // every popover available
        $scope.popovers = [];

        // simple save
        $scope.save = function() {
            return console.log(form);
        };

        $scope.saveForm = function() {
            if (form.id !== null)
            {
                NProgress.start();

                Forms.update(form.id, form, function(data) {
                    NProgress.done();
                }, function(err) {

                });

                return true;
            }
            else
            {
                // If we have form.id === null, it means we need to create a new form :D
                if (!form.name)
                {
                    alert($filter('translate')('WARNING_TYPE_TITLE'));
                    return false;
                }

                NProgress.start();

                Forms.create(form, function(data) {
                    NProgress.done();

                    form.id = data.response.form_id;
                }, function(err) {

                });

                return true;
            }
        };

        // page navigation
        $scope.nextPage = function() {
            if (form.name == null) {
                alert($filter('translate')('WARNING_TYPE_TITLE_TO_PROCEED'));

                return false;
            }

            $scope.current_page = pages[current_page + 1];
            current_page++;

            // fix this
            if (current_page == 3) {
                $(window).scroll(function(e) {
                    $scope.scrollableInputsList(e);
                });

                $scope.scrollableInputsList();
            }
        }

        $scope.prevPage = function() {
            $scope.current_page = pages[current_page - 1];
            current_page--;
        }

        $scope.toPage = function(page) {
            if (form.name == null) {
                alert($filter('translate')('WARNING_TYPE_TITLE_TO_PROCEED'));

                return false;
            }

            $scope.current_page = page;
            current_page = pages.indexOf(page);

            // Fix this
            if (current_page == 3) {
                $(window).scroll(function(e) {
                    $scope.scrollableInputsList(e);
                });

                $timeout(function() {
                    $scope.scrollableInputsList();
                }, 200);
            }
        }

        $scope.showCSVInstructions = function() {
            $('#csv_instructions').modal('show');
        };

        // stop reasons modal
        $scope.showAddReasons = function() {
            var modal = $('#reasons_modal').modal('show');
        };

        $scope.addReason = function() {
            var reschedule = false;

            if ($scope.reasonReschedule == 'true')
            {
                reschedule = true;
            }

            var reason = { reason: $scope.reasonName, reschedule: reschedule };

            if (form.id !== null)
            {
                NProgress.start();

                Forms.create_reason(form.id, reason, function(data) {
                    NProgress.done();

                    reason.id = data.response.reason_id;

                    if (typeof form.stop_reasons == 'undefined')
                    {
                        form.stop_reasons = [];
                    }

                    form.stop_reasons.push(reason);
                }, function(err) {
                    alert($filter('translate')('WARNING_CANT_ADD_REASON'));
                });

                $scope.reasonName = '';
            }
            else
            {
                alert($filter('translate')('WARNING_CANT_ADD_REASONS'));
            }
        };

        $scope.deleteReason = function(option) {
            if (form.id !== null)
            {
                NProgress.start();

                Forms.delete_reason(form.id, option.id, function() {
                    NProgress.done();

                    form.stop_reasons.splice(form.stop_reasons.indexOf(option), 1);
                }, function() {
                    alert($filter('translate')('WARNING_CANT_REMOVE_REASON'));
                });
            }
            else
            {
                alert($filter('translate')('WARNING_CANT_REMOVE_REASONS'));
            }
        };

        // Header file upload
        $scope.sendFile = function($files) {
            $scope.importing = true;
            NProgress.start();

            for (var i = 0; i < $files.length; i++) {

                var $file = $files[i];

                $http.uploadFile({
                    url: apiInfo.url + '/' + apiInfo.version +'/forms/' + form.id + '/parse_csv',
                    method: 'POST',
                    headers: { 'X-Session-ID': $cookieStore.get('session_id') },
                    data: {'file': $file}
                }).success(function(data, status, headers, config) {
                    $scope.importing = false;
                    NProgress.done();

                    $scope.showImportOptions = true;

                    $scope.csv = {
                        headers: data.response.header_columns,
                        job_id: data.response.job_id
                    };

                    $scope.$apply();
                }).error(function(data, status, headers, config) {
                    if (status == 500)
                    {
                        alert($filter('translate')('WARNING_CSV_OUT_OF_FORMAT'));
                        $scope.importing = false;
                        NProgress.done();
                    }

                    $scope.$apply();
                });
            }
        };

        $scope.saveCsv = function() {

            var data = {
                grouping: $scope.csv.current_grouping,
                substitution: $scope.csv.current_substitution,
                identifier: $scope.csv.current_identifier
            };

            if (typeof $scope.csv.current_grouping == 'undefined' || $scope.csv.current_grouping == null || $scope.csv.current_grouping == "")
            {
                alert($filter('translate')('WARNING_SELECT_OPTION'));
            }
            /*else if (typeof $scope.csv.identifier == 'undefined' || $scope.csv.identifier == null || $scope.csv.identifier == "")
             {
             alert('Selecione a opção 2, por favor.');
             }*/
            else
            {
                NProgress.start();

                Forms.import_csv(form.id, $scope.csv.job_id, data, function(data) {
                    $scope.updateForm();

                    $scope.showImportLog = true;

                    $scope.failed_imports = data.response.failed_imports;
                    $scope.successful_imports = data.response.successful_imports;
                });
            }

        };

        $scope.updateAssignmentQuota = function(assignment) {
            var assignment = assignments[assignments.indexOf(assignment)];

            NProgress.start();

            Forms.update_assignment(form.id, assignment.id, { 'quota': assignment.quota }, function(data) {
                NProgress.done();
            }, function(err) {
                alert($filter('translate')('WARNING_CANT_UPDATE_LIMIT'));
            });
        };

        $scope.deleteAssignment = function(assignment) {
            var assignment = assignments[assignments.indexOf(assignment)];

            NProgress.start();

            Forms.delete_assignment(form.id, assignment.id, function(data) {
                NProgress.done();

                assignments.splice(assignments.indexOf(assignment), 1);
            }, function(err) {

            });
        };

        // change input's list tab
        $scope.changeTab = function(tab) {
            current_tab = tabs.indexOf(tab);
            $scope.current_tab = tabs.indexOf(tab);
        };

        $scope.orderPredicate = function (item) {
            return item.order || 0;
        };

        $scope.addSection = function() {
            var section = {
                id: null,
                name: $filter('translate')('NEW_UNTITLED_PAGE'),
                order: null,
                fields: [],

                showSectionTitleInput: false,
                focusEditSectionTitle: false
            };

            if (form.id !== null)
            {
                NProgress.start();

                Forms.create_section(form.id, section, function(data) {
                    NProgress.done();

                    section.id = data.response.section_id;

                    if (typeof form.sections == 'undefined')
                    {
                        form.sections = [];
                    }

                    form.sections.push(section);
                }, function(err) {
                    alert($filter('translate')('WARNING_CANT_CREATE_SECTION'));
                });
            }
            else
            {
                alert($filter('translate')('WARNING_CANT_REMOVE_REASONS'));
            }
        };

        $scope.deleteSection = function(section) {
            if (confirm($filter('translate')('CONFIRM_REMOVE_PAGE')))
            {
                if (section.id !== null)
                {
                    NProgress.start();

                    Forms.delete_section(form.id, section.id, function() {
                        NProgress.done();

                        form.sections.splice(form.sections.indexOf(section), 1);
                    }, function() {
                        alert($filter('translate')('WARNING_CANT_REMOVE_REASON'));
                    });
                }
                else
                {
                    alert($filter('translate')('WARNING_CANT_UPDATE_PAGE_REFRESH'));
                }
            }
        };

        $scope.toggleEditSectionTitle = function(section) {
            if (section.showSectionTitleInput === true)
            {
                if (section.id !== null)
                {
                    NProgress.start();

                    Forms.update_section(form.id, section.id, section, function(data) {
                        NProgress.done();
                    }, function(err) {
                        alert($filter('translate')('WARNING_CANT_UPDATE_PAGE'));
                    });
                }
                else
                {
                    alert($filter('translate')('WARNING_CANT_UPDATE_PAGE_REFRESH'));
                }

                section.showSectionTitleInput = false;
                section.focusEditSectionTitle = false;
            }
            else
            {
                section.showSectionTitleInput = true;
                section.focusEditSectionTitle = true;
            }
        };

        // Sortable for pages
        $('#sortable_pages').sortable({
            handle: '.drag',
            update: function( event, ui ) {
                var sortedIds = $(this).sortable('toArray'), order = [];

                console.log(sortedIds);

                // Update pages objects with new order
                for (var k = 0; k < sortedIds.length; k++) {
                    var id = sortedIds[k].substr(5);

                    console.log(form.sections[id].name);
                    order.push(form.sections[id].id);
                };

                for (var i = order.length - 1; i >= 0; i--) {
                    for (var j = form.sections.length - 1; j >= 0; j--) {
                        if (form.sections[j].id == order[i])
                        {
                            form.sections[j].order = i + 1;
                        }
                    }
                }

                NProgress.start();

                Forms.update_sections(form.id, {order: order}, function() {
                    NProgress.done();
                }, function() {
                    alert($filter('translate')('WARNING_CANT_CHANGE_REASON_ORDER'));
                });
            }
        });

        $('.select_user_to_group').autocomplete({
            source: function( request, response ) {
                API('GET', '/users?name_likes=' + request.term).success(function(data) {
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
                $(this).val(ui.item.label);
                return false;
            }
        });

        // Autocomplete for adding users
        $('#inputUsers').autocomplete({
            source: function( request, response ) {
                API('GET', '/users?name_like=' + request.term + '&by_role=agent').success(function(data, status, headers) {
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
                $(this).val('');

                $timeout(function() {

                    var newAssignment = {
                        'user_id': ui.item.user.id,
                        'mod_id': null,
                        'quota': 0
                    };

                    function updateAssignments () {
                        return Forms.get_all_assignments(form.id, function (data) {
                            assignments = data.response;
                            $scope.assignments = assignments;
                            NProgress.done();
                            return assignments;
                        })
                    }

                    function createNewAssignment(assignments) {
                            var createAssignment = true;
                            angular.forEach(assignments, function (assignment) {
                                if (assignment.user.id === newAssignment.user_id) {
                                    createAssignment = false;
                                }
                            });
                            if (createAssignment) {
                                Forms.create_assignment(form.id, newAssignment, function () {
                                    updateAssignments();
                                });
                            }
                    }

                    NProgress.start();

                    if ($scope.assignments.length) {
                        createNewAssignment($scope.assignments);
                    } else {
                        updateAssignments().
                            then(function (xhr) {
                                 createNewAssignment(xhr.data.response);
                             });
                    }
                });

                return false;
            }
        });

        // Fix inputs options div when scroll is big
        $scope.scrollableInputsList = function(e) {
            var scroller_anchor = $('.scroller_anchor').offset().top;

            if ($(window).scrollTop() >= scroller_anchor && $('.inputs_options').css('position') != 'fixed')
            {
                $('.inputs_options').css({
                    'width': '730px',
                    'position': 'fixed',
                    'top': '10px',
                    'z-index': '1000'
                });

                $('.scroller_anchor').css('height', '150px');
            }
            else if ($(window).scrollTop() < scroller_anchor && $('.inputs_options').css('position') != 'relative')
            {
                $('.scroller_anchor').css('height', '0px');

                $('.inputs_options').css({
                    'position': 'relative'
                });
            }
        };
    }
];