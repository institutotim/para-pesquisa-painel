/**
 * Created by luizfilipe on 10/12/14.
 */


module.exports = function(API) {
    return {
        getPage: function(page, form_id, success, error) {
            API('GET', '/forms/' + form_id + '/submissions?page=' + page).success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error();
            });
        },

        get: function(form_id, id, success, error) {
            API('GET', '/forms/' + form_id + '/submissions/' + id).success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error(data);
            });
        },
    }
};