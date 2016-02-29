/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

var angular = require('angular');

module.exports = angular.module('uppSocial.directives', []).
    directive('navItem', require('./nav-item')).
    directive('focusMe', require('./focus-me')).
    directive('itemDraggable', require('./item-draggable')).
    directive('itemDroppable', require('./item-droppable')).
    directive('inputItem', require('./input-item')).
    directive('assignmentItem', require('./assignment-item')).
    directive('submissionItem', require('./submission-item')).
    directive('avatar', require('./avatar')).
    directive('compile', require('./compile')).
    directive('sidebar', require('./sidebar')).
    directive('filterAutocomplete', require('./filter-auto-complete')).
    directive('deleteModal', require('./delete-modal')).
    directive('transferModal', require('./transfer-modal')).
    directive('translateUiDate', require('./translate-ui-date'));