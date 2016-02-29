/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function(rSubmissions) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            for (var i = scope.submission.log.length - 1; i >= 0; i--) {
                if (scope.submission.log[i].action == 'canceled' || scope.submission.log[i].action == 'rescheduled')
                {
                    scope.submission.stop_reason = scope.submission.log[i].stop_reason.reason;
                }
            };

            scope.changeStatus = function(status) {
                NProgress.start();

                var sub = new rSubmissions(scope.submission);

                sub.set('status', status);

                sub.save(function() {
                    scope.submission.status = status;
                    NProgress.done();
                });
            };

            scope.reset = function() {
                if (confirm('Tem certeza que você deseja restituir este formulário?'))
                {
                    NProgress.start();

                    var sub = new rSubmissions(scope.submission);

                    sub.reset(function() {
                        scope.submission.status = 'new';
                        NProgress.done();
                    });
                }
            };

        }
    };
};