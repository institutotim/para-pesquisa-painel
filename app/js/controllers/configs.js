/* globals NProgress */
/**
 * Created by luizfilipe on 09/12/14.
 */

'use strict';

/**
 @name List app configs
 @desc It gets /app/texts for editing
 @url #/users
 */

module.exports = [
    '$scope',
    '$rootScope',
    '$http',
    '$cookieStore',
    '$translate',
    'API',
    'Texts',
    'Application',
    'apiInfo',
    function($scope, $rootScope, $http, $cookieStore, $translate, API, Texts,
             Application, apiInfo) {
        var items_loaded = 0;

        $scope.availableLanguages = {
            en: {
                label: 'EN_LANG',
                value: 'en_EN'
            },
            pt: {
                label: 'PT_LANG',
                value: 'pt_BR'
            }
        };

        // Show loading
        $rootScope.showLoading = true;
        NProgress.start();

        var hideLoading = function() {
            if (items_loaded !== 2) return false;

            $rootScope.showLoading = false;
            NProgress.done();
        };

        $scope.$watch('selectedLanguage', function (language, lastLanguage) {
            if ($scope.application &&
                  // avoid first call to change, this occurs soon as user enter on configuration area
                    lastLanguage &&
                    !~$scope.application.language.indexOf(language)) {
                $scope.application.language = language.value;
                $scope.updateApplication();
            }
        });

        // Get application details
        Application.fetch(function(data) {
            $scope.application = data.response;
            $scope.selectedLanguage = $scope.availableLanguages[
                $scope.application.language.substr(0, 2).toLowerCase()];

            // Set header_url as background and delete it so it will not update in a PUT request
            if (data.response.header_url !== null) {
                $('#header_image').css('background-image', 'url(' + data.response.header_url + ')');
            }
            delete $scope.application.header_url;

            items_loaded++;

            hideLoading();
        }, function(err) {

        });

        // And all the texts :D
        Texts.getAll(function(data) {
            $scope.texts = data.response;
            items_loaded++;

            hideLoading();
        }, function(err) {

        });

        // Header file upload
        $scope.onFileSelect = function($files) {
            NProgress.start();
            $('#header_image').addClass('loading');

            for (var i = 0; i < $files.length; i++) {

                var $file = $files[i];

                $http.uploadFile({
                    url: apiInfo.url + '/' + apiInfo.version +'/application',
                    method: 'POST',
                    headers: { 'X-Session-ID': $cookieStore.get('session_id') },
                    data: {'header': $file},
                }).then(function(data, status, headers, config) {

                    Application.fetch(function(data) {
                        // Set header_url as background and delete it so it will not update in a PUT request
                        if (data.response.header_url !== null)
                        {
                            $('#header_image').css('background-image', 'url(' + data.response.header_url + ')');
                        }

                        NProgress.done();
                        $('#header_image').removeClass('loading');
                    }, function(err) {

                    });

                    console.log(data);
                });
            }
        };

        $scope.removeImage = function() {
            NProgress.start();
            $('#header_image').addClass('loading');

            Application.update({ header: null }, function(data) {
                $('#header_image').removeClass('loading');
                $('#header_image').css('background-image', '');

                NProgress.done();
            }, function(err) {
            });
        };

        $scope.updateApplication = function() {
            NProgress.start();

            Application.update($scope.application, function() {
                $scope.showMessage = 'success';
                $translate.use($scope.application.language.substr(0, 2).toLowerCase());
                NProgress.done();
            }, function(err) {
                $scope.showMessage = 'error';
                NProgress.done();
            });
        };
    }
];