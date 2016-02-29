/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function() {
    return function(role) {
        if (role == 'api')
        {
            return 'ROLE_ADMINISTRATOR';
        }
        else if (role == 'mod')
        {
            return 'ROLE_COORDINATOR';
        }
        else if (role == 'agent')
        {
            return 'ROLE_RESEARCHER';
        }
        else
        {
            return '';
        }
    }
};