/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function() {
    return function(message) {
        if (message == 'user_not_found')
        {
            return 'usuário não encontrado';
        }
        else
        {
            return message;
        }
    };
};