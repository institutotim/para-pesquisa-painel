/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function() {
    return function(arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i].read_only == true)
            {
                arr.splice(i, 1);
            }
        };

        return arr;
    }
};