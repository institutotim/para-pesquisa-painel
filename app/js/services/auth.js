/**
 * Created by luizfilipe on 10/12/14.
 */

module.exports = [
    '$cookieStore',
    '$rootScope',
    'API',
    function($cookieStore, $rootScope, API) {
        var user = {
            id: null,
            logged: false
        };

        var session_id_cookie = $cookieStore.get('session_id'),
            user_id_cookie = $cookieStore.get('user_id');

        return {
            login: function(userData, success, error) {
                var that = this;

                API('POST', '/session', false, userData).
                    success(function(data) {
                        $cookieStore.put('session_id', data.response.session_id);
                        $cookieStore.put('user_id', data.response.user_id);

                        session_id_cookie = data.response.session_id;
                        user_id_cookie = data.response.user_id;

                        that.getUserInfo(function() {
                            success();
                        }, function() {
                            console.log('error data validation');
                        });
                    }).error(function() {
                        error();
                    });
            },

            isLogged: function() {
                return this.getUser().logged;
            },

            getUser: function() {
                return user;
            },

            checkCookies: function(callback) {
                if (typeof (session_id_cookie) !== "undefined" && typeof (user_id_cookie) !== "undefined" && this.getUser().id == null)
                {
                    this.getUserInfo(function() {
                        callback();
                    }, function() {
                        callback();
                    });
                }
                else
                {
                    callback();
                }
            },

            getUserInfo: function(success, error) {
                API('GET', '/users/' + user_id_cookie).success(function(data, status, headers) {

                    // Set basic user data
                    user = data.response;
                    user.logged = true;


                    console.log(user);

                    $rootScope.user = user;

                    success(data);
                }).error(function() {
                    error();
                });
            },

            logout: function(success) {
                API('DELETE', '/session/').success(function(data, status, headers) {
                    $cookieStore.remove('session_id');
                    $cookieStore.remove('user_id');
                    session_id_cookie = undefined;
                    user_id_cookie = undefined;

                    // Reset user
                    user = {
                        id: null,
                        access: 0,
                        logged: false
                    };

                    if (typeof success !== 'undefined') success();
                }).error(function() {
                    // :(
                });
            }
        }
    }
]