/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

var angular = require('angular');
module.exports = angular.module('uppSocial.services', []).
    factory('Request', require('./request')).
    factory('rUser', require('./user')).
    factory('rSubmissions', require('./r-submissions')).
    factory('Statistics', require('./statistics')).
    factory('Logs', require('./logs')).
    factory('Assignment', require('./assignment')).
    factory('Exports', require('./exports')).
    factory('API', require('./api')).
    factory('Auth', require('./auth')).
    factory('Users', require('./users')).
    factory('Application', require('./application')).
    factory('Texts', require('./texts')).
    factory('Forms', require('./forms')).
    factory('Submissions', require('./submissions')).
    factory('Options', require('./options'));
