/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function($interpolate, $compile, Forms, $filter) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            var options = {
                accept: ':not(.ui-sortable-helper)',
                activeClass: 'active-effect',
                hoverClass: 'hover-effect',
                drop: function( event, ui ) {
                    var inputType = ui.draggable.attr('name');

                    $(this).find('.item').remove();

                    var newField = {
                        id: null,
                        label: $filter('translate')('NEW_FIELD_TITLE', { field_name: $filter('translate')(Forms.getAvailableInputs()[inputType].name) }),
                        description: null,
                        type: inputType,
                        order: null,
                        layout: null,
                        options: [],
                    };

                    if (scope.section.id !== null)
                    {
                        NProgress.start();

                        Forms.create_section_field(scope.$parent.form.id, scope.section.id, newField, function(data) {
                            NProgress.done();

                            newField.id = data.response.field_id;

                            scope.section.fields.push(newField);
                        }, function() {
                            alert($filter('translate')('WARNING_CANT_CREATE_FIELD'));
                        });
                    }
                    else
                    {
                        alert($filter('translate')('WARNING_CANT_UPDATE_SECTION'));
                    }

                    scope.$digest();
                }
            };

            element
                .droppable(options)
                .sortable({
                    items: 'li:not(.item,.option_item)',
                    update: function() {
                        var sortedIds = $(this).sortable('toArray'), order = [];

                        for (var k = 0; k < sortedIds.length; k++) {
                            var id = sortedIds[k].substr(5);

                            if (sortedIds[k] !== '')
                            {
                                order.push(scope.section.fields[id].id);
                            }
                        }

                        for (var i = order.length - 1; i >= 0; i--) {
                            for (var j = scope.section.fields.length - 1; j >= 0; j--) {
                                if (scope.section.fields[j].id == order[i])
                                {
                                    scope.section.fields[j].order = i + 1;
                                }
                            }
                        }

                        NProgress.start();

                        Forms.update_section_fields(scope.$parent.form.id, scope.section.id, {order: order}, function() {
                            NProgress.done();
                        }, function() {
                            alert($filter('translate')('WARNING_CANT_UPDATE_REASON_ORDER'));
                        });
                    }
                });
        }
    };
};