/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            var options = {
                helper: 'clone'
            };

            element.draggable(options);
        }
    };
};