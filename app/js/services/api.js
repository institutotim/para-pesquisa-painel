/**
 * Created by luizfilipe on 10/12/14.
 */

/* To-do: refactor code below */

module.exports = [
    '$http',
    '$cookieStore',
    'apiInfo',
    function($http, $cookieStore, apiInfo) {
        return function(method, url, pass_token, data) {
            var config = {
                method: method,
                url: apiInfo.url + '/' + apiInfo.version + url,
                params: {ver: Math.random()}
            };

            if(typeof pass_token === 'undefined' || pass_token === true) {
                config.headers = {
                    'X-Session-ID': $cookieStore.get('session_id')
                };
            }

            if(typeof data !== 'undefined') {
                config.data = data;
            }

            return $http(config);
        };
    }
];