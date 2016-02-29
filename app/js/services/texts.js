/**
 * Created by luizfilipe on 10/12/14.
 */


module.exports = function(API) {
    return {
        getAll: function(success, error) {
            API('GET', '/texts').success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error();
            });
        },

        get: function(id, success, error) {
            API('GET', '/texts/' + id).success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error();
            });
        },

        create: function(data, success, error) {
            API('POST', '/texts', true, data).success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error(data);
            });
        },

        update: function(id, data, success, error) {
            API('PUT', '/texts/' + id, true, data).success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error(data);
            });
        },

        delete: function(id, data, success, error) {
            API('DELETE', '/texts/' + id).success(function(data, status, headers) {
                success(data);
            }).error(function() {
                success(data);
            });
        }
    };
};