/* globals NProgress */
/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';


/**
 @name View a submission
 @url #/forms/edit/{id}/submissions/{id}
 */

module.exports = ['$scope', '$rootScope', '$compile', '$routeParams', 'Forms', 'rSubmissions', function($scope, $rootScope, $compile, $routeParams, Forms, rSubmissions) {
    var form_id = $routeParams.formId, id = $routeParams.submissionId;

    $rootScope.showLoading = true;
    $scope.orderPredicate = function (item) {
        return item.order || 0;
    };
    NProgress.start();
    Forms.get(form_id, function(data) {
        $scope.form = data.response;

        var submission = new rSubmissions(id, form_id);

        submission.get({
            success: function(data) {
                $scope.submission = data;

                $scope.getAnswerByFieldId = function(id) {
                    for (var i = 0; i < data.answers.length; i++) {
                        if (data.answers[i][0] == id)
                        {
                            return data.answers[i][1];
                        }
                    };

                    return '';
                };

                // Hide loading
                $rootScope.showLoading = false;
                NProgress.done();
            }
        });
    }, function(err) {

    });

    var hidden_unanswered_questions = false;

    $scope.hideUnansweredQuestions = function() {
        $('.field').each(function() {
            var content = $(this).find('.field_content').html();

            if (content == '')
            {
                $(this).fadeToggle(200);
            }
        });

        $('.hide_unanswered_fields').toggleClass('active');
    };
}];