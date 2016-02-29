/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function(API) {
    return {
        link: function(scope, element) {
            element.autocomplete({
                source: function( request, response ) {

                    var url = '/users?name_like=' +
                              request.term + '&by_role=agent,mod';

                    API('GET', url).success(function(data) {
                        response( $.map( data.response, function( item ) {
                            return {
                                label: item.name,
                                value: item.name,
                                user: item
                            };
                        }));
                    });
                },

                open: function(){
                    $(this).autocomplete('widget').css('z-index', 2000);
                    return false;
                },

                select: function (event, ui) {
                    $(this).val(ui.item.user.name);
                    scope.enable_search_by_user = false;

                    scope.user_id = ui.item.user.id;
                    scope.user_name = ui.item.user.name;

                    scope.fetchSubmissions(true);

                    scope.removeUser = function() {
                        scope.enable_search_by_user = true;

                        scope.user_id = null;
                        scope.user_name = null;

                        scope.fetchSubmissions(true);
                    };

                    return false;
                }
            });
        }
    };
};