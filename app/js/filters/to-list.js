/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function() {
    return function(t) {
        if (typeof t == 'object')
        {
            var html = '';

            for (var i = 0; i < t.length; i++) {
                html += '<li>' + t[i] + '</li>';
            }

            return html;
        }

        return t;
    };
};