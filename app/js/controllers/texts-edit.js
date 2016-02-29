/**
 * Created by luizfilipe on 09/12/14.
 */

'use strict';

/**
 @name Edit or add system texts
 @url #/texts/(edit|create)/{id?}
 */

module.exports = [
    '$scope',
    '$rootScope',
    '$routeParams',
    'Texts',
    function($scope, $rootScope, $routeParams, Texts) {
        var id = $routeParams.textId, updating = true;

        if (id === undefined) {
            updating = false;
        }

        $scope.text = {};
        $scope.updating = updating;

        tinymce.init({
                         selector:'textarea',
                         language: 'pt_BR'
                     });

        if (updating === true)
        {
            $rootScope.showLoading = true;
            NProgress.start();

            Texts.get(id, function(data) {
                // Hide loading
                $rootScope.showLoading = false;
                NProgress.done();

                $scope.text = data.response;
                tinymce.get('inputContent').setContent($scope.text.content)
            }, function(err) {

            });
        }

        $scope.send = function() {
            var formattedObj = {
                'title' : $scope.text.title,
                'subtitle' : $scope.text.subtitle,
                'content' : tinymce.get('inputContent').getContent()
            };

            if (updating === false)
            {
                Texts.create(formattedObj, function(data) {
                    $scope.text.id = data.response.text_id;
                    $scope.showMessage = 'success';
                }, function(data) {
                    $scope.showMessage = 'error';
                });
            }
            else
            {
                Texts.update(id, formattedObj, function(data) {
                    $scope.showMessage = 'success';
                }, function(data) {
                    $scope.showMessage = 'error';
                });
            }
        }
    }
];