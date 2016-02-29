/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';


module.exports = function(API, Forms, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.find('.changeMod').autocomplete({
                source: function( request, response ) {

                    API('GET', '/users?name_like=' + request.term + '&by_role=mod').success(function(data, status, headers) {
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

                    $timeout(function() {
                        NProgress.start();

                        Forms.update_assignment(scope.$parent.form.id, scope.assignment.id, { 'mod_id' : ui.item.user.id }, function(data) {
                            NProgress.done();
                        }, function() {

                        });
                    });

                    return false;
                }
            });


        }
    }
};