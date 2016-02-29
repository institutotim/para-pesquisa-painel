/**
 * Created by luizfilipe on 10/12/14.
 */

module.exports = function(API) {
    return {
        fetch: function(success, error) {
            API('GET', '/application').success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error();
            });
        },

        update: function(data, success, error) {
            API('PUT', '/application', true, data).success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error(data);
            });
        },
    }
};