/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function() {
    return function(action) {
        if (action == 'created')
        {
            return 'criou uma pesquisa';
        }
        else if (action == 'started')
        {
            return 'iniciou uma pesquisa';
        }
        else if (action == 'revised')
        {
            return 'revisou uma pesquisa';
        }
        else if (action == 'approved')
        {
            return 'aprovou uma pesquisa';
        }
        else if (action == 'reproved')
        {
            return 'reprovou uma pesquisa';
        }
        else if (action == 'rescheduled')
        {
            return 'reagendou uma pesquisa';
        }
        else if (action == 'transferred')
        {
            return 'transferiu uma pesquisa';
        }
        else if (action == 'canceled')
        {
            return 'cancelou uma pesquisa';
        }
        else if (action == 'reset')
        {
            return 'restituiu uma pesquisa';
        }
        else
        {
            return action;
        }
    };
};