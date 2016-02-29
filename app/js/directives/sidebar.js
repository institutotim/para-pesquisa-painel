/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';


/**
 * Here's how this thing works:
 * 1) <sidebar>content to be shown in root view</sidebar> is inserted in a
 *  partial (child scope)
 * 2) <div compile="sidebar"></div> is inserted in the root view (root scope)
 * 3) $compile the html with the child scope
 * 4) MAGIC
 */
module.exports = function($rootScope) {
    var html;

    return {
        restrict: 'E',
        compile: function(tElement) {
            html = tElement.html(); // MAGIC!

            return function (scope, element) {
                element.hide();

                // everytime $digest is invoked we interpolate our directive
                // content with the current scope :)
                scope.$watch(function() {
                    $rootScope.sidebar = html;
                    $rootScope.temp_scope = scope;
                });
            };
        }
    };
};
