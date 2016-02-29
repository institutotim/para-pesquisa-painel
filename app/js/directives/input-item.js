/* globals angular */
/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = [
    '$interpolate',
    '$compile',
    '$timeout',
    'Forms',
    'Options',
    '$filter',
    function($interpolate, $compile, $timeout, Forms, Options, $filter) {
        var availableFields = [];
        return {
            restrict: 'A',
            link: function(scope, element) {
                var fieldType = scope.field.type;
                scope.available_layouts = Forms.getAvailableInputs()[fieldType].
                    available_layouts;
                angular.forEach(scope.$parent.section.fields, function (field) {
                    if (!~availableFields.indexOf(field)) {
                        availableFields.push(field);
                    }
                });
                scope.available_fields = availableFields;
                scope.selected_inject_option = 'none';

                var title_html = $('#input_popover_template_title').html();
                var html = $('#input_popover_template').html();
                var all_popovers = scope.$parent.$parent.popovers;

                var li_content_element = element.find('.li-content');

                li_content_element.popover({
                    html : true,
                    title: title_html,
                    content: html,
                    placement: 'top',
                    delay: 150
                });

                // Add popover to popover's array so we can hide it after
                all_popovers.push(li_content_element);

                li_content_element.on('shown.bs.popover', function () {
                    // Hide all others popovers
                    // THINK FOR A BETTER METHOD
                    for (var i = all_popovers.length - 1; i >= 0; i--) {
                        if (all_popovers[i] !== li_content_element)
                        {
                            all_popovers[i].popover('hide');
                            all_popovers[i].next('.popover').remove();
                        }
                    }

                    angular.element('div.content.ui-droppable.ui-sortable').sortable('disable');

                    var t = li_content_element.next('.popover').find('.popover-title').html(title_html);
                    var e = li_content_element.next('.popover').find('.popover-content').html(html);

                    $compile(e)(scope);
                    $compile(t)(scope);
                    scope.$apply();
                });

                if (typeof scope.field.validations !== 'undefined' && typeof scope.field.validations.required !== 'undefined' && scope.field.validations.required == true)
                {
                    scope.required = true;
                }

                if (typeof scope.field.identifier !== 'undefined' && scope.field.identifier == true)
                {
                    scope.required = true;
                }

                scope.toggleRequired = function() {
                    if (typeof scope.field.validations == 'undefined')
                    {
                        scope.field.validations = {
                            required: true
                        };
                    }
                    else
                    {
                        if (typeof scope.field.validations.required == 'undefined')
                        {
                            scope.field.validations.required = true;
                        }
                        else
                        {
                            if (scope.field.validations.required == true)
                            {
                                scope.field.validations.required = false;
                            }
                            else
                            {
                                scope.field.validations.required = true;
                            }
                        }
                    }
                };

                scope.toggleIdentifier = function() {
                    if (typeof scope.field.identifier == 'undefined')
                    {
                        scope.field.identifier = true;
                    }
                    else
                    {
                        if (scope.field.identifier == true)
                        {
                            scope.field.identifier = false;
                        }
                        else
                        {
                            scope.field.identifier = true;
                        }
                    }
                };

                scope.toggleHasOther = function() {
                    for (var i = 0; i < scope.field.options.length; i++)
                    {
                        if (scope.field.options[i].value == 'other')
                        {
                            scope.field.options.splice(i, 1);

                            return;
                        }
                    };

                    scope.field.options.push({ label: $filter('translate')('OTHER_SPECIAL_OPTION'), value: 'other' });
                };

                scope.checkIfHasOther = function() {
                    if (typeof scope.field.options !== 'undefined')
                    {
                        for (var i = 0; i < scope.field.options.length; i++)
                        {
                            if (scope.field.options[i].value == 'other')
                            {
                                scope.hasOther = true;

                                return;
                            }
                        }
                    }

                    scope.hasOther = false;
                };

                scope.injectOptions = function() {
                    if (scope.selected_inject_option && scope.selected_inject_option !== 'none')
                    {
                        var options = Options.getOptionsForInject(scope.selected_inject_option);

                        if (typeof scope.field.options == 'undefined')
                        {
                            scope.field.options = [];
                        }

                        for (var i = 0 ; i < options.length; i++) {
                            scope.field.options.push({ label: options[i], value: options[i] });
                        };
                    }
                };

                scope.updateItem = function() {
                    NProgress.start();

                    Forms.update_section_field(scope.$parent.$parent.form.id, scope.$parent.section.id, scope.field.id, scope.field, function(data) {
                        NProgress.done();
                    }, function(err) {
                        alert($filter('translate')('WARNING_CANT_UPDATE_FIELD'));
                    });
                };

                scope.deleteItem = function(field) {
                    if (confirm($filter('translate')('CONFIRM_REMOVE_FIELD')))
                    {
                        NProgress.start();

                        Forms.delete_section_field(scope.$parent.$parent.form.id, scope.$parent.section.id, scope.field.id, function(data) {
                            NProgress.done();
                        }, function(err) {
                            alert($filter('translate')('WARNING_CANT_REMOVE_FIELD'));
                        });

                        scope.$parent.section.fields.splice(scope.$parent.section.fields.indexOf(field), 1);
                        li_content_element.popover('hide');
                        li_content_element.next('.popover').remove();
                    }
                };

                scope.copyItem = function(field) {
                    var newField = angular.copy(field);

                    newField.id = null;
                    newField.label = $filter('translate')('FIELD_COPY_OF', { field_name: newField.label });

                    NProgress.start();

                    Forms.create_section_field(scope.$parent.$parent.form.id, scope.$parent.section.id, newField, function(data) {
                        NProgress.done();

                        newField.id = data.response.field_id;

                        scope.$parent.section.fields.push(newField);
                    }, function(err) {
                        alert($filter('translate')('WARNING_CANT_COPY_FIELD'));
                    });
                };

                scope.closePopover = function() {
                    li_content_element.popover('hide');
                    li_content_element.next('.popover').remove();
                    angular.element('div.content.ui-droppable.ui-sortable').sortable('enable');

                    scope.updateItem();
                };

                scope.showAddOptions = function() {
                    var modal = element.find('.modal').modal('show');
                };

                scope.addOption = function() {
                    if (typeof scope.field.options == 'undefined')
                    {
                        scope.field.options = [];
                    }

                    scope.field.options.push({ label: scope.valueName, value: scope.valueName });
                    scope.valueName = '';
                };

                scope.deleteOption = function(option) {
                    scope.field.options.splice(scope.field.options.indexOf(option), 1);

                    // deactivate checkbox for "others"
                    scope.checkIfHasOther();
                };

                scope.editOption = function(option) {
                    var newLabel = window.prompt($filter('translate')('PROMPT_EDIT_OPTION_TEXT'), { field_name: option.label });

                    if (newLabel != null)
                    {
                        scope.field.options[scope.field.options.indexOf(option)] = { label: newLabel, value: newLabel};
                    }
                };

                scope.addAction = function() {

                    if (typeof scope.field.actions == 'undefined')
                    {
                        scope.field.actions = [];
                    }

                    var action = {
                        when: scope.action_selected_options,
                        disable: scope.action_selected_disable_fields
                    };

                    scope.field.actions.push(action);
                };

                scope.removeAction = function(action) {
                    scope.field.actions.splice(scope.field.actions.indexOf(action), 1);
                };

                scope.getFieldLabelById = function(id) {
                    for (var i = scope.available_fields.length - 1; i >= 0; i--) {
                        if (scope.available_fields[i].id == id)
                        {
                            return scope.available_fields[i].label;
                        }
                    };
                };

                scope.checkIfHasOther();

                element.find('.options_sortable').sortable({
                    update: function() {
                        var sortedIds = $(this).sortable('toArray'), newArray = [];

                        console.log(sortedIds, 'ids');
                        console.log(scope.field.options, 'options');

                        // Update pages objects with new order
                        for (var i = 0; i < sortedIds.length; i++) {
                            var id = sortedIds[i].substr(7);

                            newArray.push(scope.field.options[id]);
                        }

                        $timeout(function() {
                            scope.field.options = newArray;
                        });

                        console.log(newArray, 'newArray');
                    }
                });
            }
        };
    }
];