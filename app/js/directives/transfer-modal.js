/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function(rUser) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: { transferSubmissions: '&callback' },
        templateUrl: 'partials/directives/transfer-modal.html',
        link: function(scope, element) {
            var user = new rUser();

            user.fetchAll({
                no_pagination: true,
                success: function(data) {
                    scope.users = data;
                }
            });

            scope.transfer = function(to) {
                if (confirm('Você tem certeza que deseja transferir ' +
                            'todas as pesquisas deste usuário?'))
                {
                    NProgress.start();

                    scope.transferSubmissions()(to, function() {
                        NProgress.done();
                        scope.success = true;
                    });
                }
            };

            element.on('hidden.bs.modal', function () {
                scope.success = false;
            });
        }
    };
};
