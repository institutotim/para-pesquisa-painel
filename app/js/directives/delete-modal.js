/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports =  function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: { deleteForm: '&callback' },
        templateUrl: 'partials/directives/delete-modal.html',
        link: function(scope, element) {
            scope.delete_a = function() {
                scope.delete = null;
                scope.deleteForm();

                element.modal('hide');

                return true;
            };
        }
    };
};