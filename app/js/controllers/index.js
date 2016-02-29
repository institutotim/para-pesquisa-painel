/**
 * Created by luizfilipe on 09/12/14.
 */

'use strict';

var angular = require('angular');

module.exports = angular.module('uppSocial.controllers', []).
    controller('LoginCtrl', require('./login')).
    controller('UserLogoutCtrl', require('./logout')).
    controller('StatisticsCtrl', require('./statistics')).
    controller('ExportsCtrl', require('./exports')).
    controller('UsersCtrl', require('./users')).
    controller('UsersEditCtrl', require('./users-edit')).
    controller('ConfigsCtrl', require('./configs')).
    controller('TextsEditCtrl', require('./texts-edit')).
    controller('TextsDeleteCtrl', require('./texts-delete')).
    controller('FormsCtrl', require('./forms')).
    controller('FormsListCtrl', require('./forms-list')).
    controller('FormsListAssignmentsCtrl', require('./forms-list-assignments')).
    controller('FormsEditCtrl', require('./forms-edit')).
    controller('FormsSubmissionsListCtrl', require('./forms-submissions-list')).
    controller('FormsSubmissionsViewCtrl', require('./forms-submissions-view')).
    controller('LogsCtrl', require('./logs')).
    controller('404Ctrl', require('./404'));
