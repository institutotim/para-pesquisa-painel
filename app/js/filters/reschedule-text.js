/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function() {
    return function(text) {
        if (text == true)
        {
            return 'RESCHEDULE';
        }
        else
        {
            return 'CANCEL';
        }
    }
};
