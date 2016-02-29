/**
 * Created by luizfilipe on 10/12/14.
 */


module.exports = function(API) {
    return {
        getAll: function(success, error) {
            API('GET', '/users?as=collection').success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error();
            });
        },

        get: function(id, success, error) {
            API('GET', '/users/' + id).success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error();
            });
        },

        create: function(data, success, error) {
            API('POST', '/users', true, data).success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error(data);
            });
        },

        update: function(id, data, success, error) {
            API('PUT', '/users/' + id, true, data).success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error(data);
            });
        },

        delete: function(id, success, error) {
            API('DELETE', '/users/' + id).success(function(data, status, headers) {
                success();
            }).error(function() {
                error();
            });
        }
    };
};