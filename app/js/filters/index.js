/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

var angular = require('angular');

module.exports = angular.module('uppSocial.filters', []).
    filter('formTypeName', require('./form-type-name')).
    filter('showOptionsBtn', require('./show-options-btn')).
    filter('roleName', require('./role-name')).
    filter('rescheduleText', require('./reschedule-text')).
    filter('toList', require('./to-list')).
    filter('hideExtraData', require('./hide-extra-data')).
    filter('logAction', require('./log-action')).
    filter('csvMessages', require('./csv-messages')).
    filter('cut', require('./cut'));