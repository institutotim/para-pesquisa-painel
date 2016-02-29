/* globals NProgress, alert, angular */
/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

/**
 @name List forms
 @url #/forms/list
 */


module.exports = [
    '$rootScope',
    '$scope',
    'Forms',
    function($rootScope, $scope, Forms) {
        var updateForms = function() {
            Forms.getAll(function(data) {
                $scope.forms = data.response;

                // Hide loading
                $rootScope.showLoading = false;
                NProgress.done();
            }, function(err) {

            });
        };

        $rootScope.showLoading = true;
        NProgress.start();
        updateForms();

        $scope.selectSurveyToDelete = function (id) {
            $scope.$parent.delete_id = id;
            angular.element('#deleteModal').modal('show');
        };


        $scope.deleteForm = function() {
            NProgress.start();

            Forms.delete($scope.delete_id, function() {
                updateForms();
            }, function() {
                alert('Não foi possível remover o formulário.');
            });
        };
    }
];