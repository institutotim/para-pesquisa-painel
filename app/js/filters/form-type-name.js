/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function(Forms) {
    return function(type) {
        if (typeof type !== 'undefined')
        {
            return Forms.getAvailableInputs()[type].name;
        }

        return type;
    };
};