/**
 * Created by luizfilipe on 10/12/14.
 */

module.exports = function(Request) {

    var statistics;

    var Statistics = function(s) {
        if (typeof s == 'object')
        {
            statistics = s;
        }
    };

    Statistics.prototype.fetchGlobal = function(options) {
        var req = new Request();

        req.path('/statistics');

        req.onSuccess(function(data, status, headers) {
            options.success(data.response);
        });

        req.get();
    };

    Statistics.prototype.fetchForm = function(options) {
        var req = new Request();

        req.path('/forms/' + statistics.form_id + '/statistics');

        req.onSuccess(function(data, status, headers) {
            options.success(data.response);
        });

        req.get();
    };

    Statistics.prototype.fetchUser = function(options) {
        var req = new Request();

        req.path('/users/' + statistics.user_id + '/statistics');

        req.onSuccess(function(data, status, headers) {
            options.success(data.response);
        });

        req.get();
    };

    Statistics.prototype.fetchFormUser = function(options) {
        var req = new Request();

        req.path('/forms/' + statistics.form_id + '/users/' + statistics.user_id + '/statistics');

        req.onSuccess(function(data, status, headers) {
            options.success(data.response);
        });

        req.get();
    };

    return Statistics;
};