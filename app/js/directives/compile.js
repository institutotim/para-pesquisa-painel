/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function($compile, $rootScope) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                return scope.$eval(attrs.compile);
            },
            function(value) {
                element.html(value);

                if (typeof scope.temp_scope === 'undefined')
                {
                    scope.temp_scope = scope;
                }

                $compile(element.contents())(scope.temp_scope);
            }
        );
    };
};