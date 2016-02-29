/**
 * Created by luizfilipe on 09/12/14.
 */

'use strict';

/**
 @name Delete system text
 @url #/texts/delete/{id}
 */

module.exports = ['$scope', '$routeParams', 'Texts', function($scope, $routeParams, Texts) {
    var id = $routeParams.textId;

    $scope.deleteText = function() {
        Texts.delete(id, function(data) {
            $scope.showMessage = 'success';
        }, function(data) {
            $scope.showMessage = 'success';
        });
    }
}];