/**
 * Created by luizfilipe on 10/12/14.
 */

/* global angular */
'use strict';

module.exports = [
    '$http',
    '$cookieStore',
    '$q',
    'apiInfo',
    function (http, cookieStore, q, apiInfo) {

        function Request(config) {
            if (!angular.isDefined(config)) {
                this.config = {
                    base_url: apiInfo.url + '/' + apiInfo.version,
                    params: {}
                };
            } else {
                this.config = config;
            }
        }

        angular.extend(Request.prototype, {
            getConfig: function() {
                return this.config;
            },

            setMethod: function(method) {
                this.getConfig().method = method;
            },

            // Add path to current base url
            path: function(path) {
                this.getConfig().url = this.getConfig().base_url + path;
            },

            addToken: function(token) {
                this.getConfig().headers = { 'X-Session-ID': token };
            },

            addParam: function(param_name, param) {
                this.getConfig().params[param_name] = param;
            },

            setData: function(data) {
                this.getConfig().data = data;
            },

            // Get elements from page @page
            fromPage: function(page) {
                this.addParam('page', page);
            },
            // Add ?created_from and ?created_to
            created_between: function(options) {
                if (options[0] !== null)
                {
                    this.addParam('created_from', options[0]);
                }

                if (options[1] !== null)
                {
                    this.addParam('created_to', options[1]);
                }
            },
            updated_between: function(options) {
                if (options[0] !== null)
                {
                    this.addParam('updated_from', options[0]);
                }

                if (options[1] !== null)
                {
                    this.addParam('updated_to', options[1]);
                }
            },
            /* Status callbacks */
            onSuccess: function(callback) {
                this.getConfig().success = callback;
            },
            onError: function(callback) {
                this.getConfig().error = callback;
            },
            hasOnSuccess: function() {
                return (typeof this.getConfig().success !== 'undefined');
            },
            hasOnError: function() {
                return (typeof this.getConfig().error !== 'undefined');
            },
            removeToken: function() {
                this.remove_token = true;
            },

            checkUnvalidToken : function(http) {
                var that = this;

                http.error(function(data, status, headers) {
                    if(status === 403)
                    {
                        cookieStore.remove('session_id');
                        cookieStore.remove('user_id');

                        window.location.reload();

                        delete that.getConfig().error;
                    }
                });
            },
            make: function() {
                if (this.remove_token !== true) {
                    this.addToken(cookieStore.get('session_id'));
                }

                var request = http(this.getConfig());

                this.checkUnvalidToken(request);

                return request;
            },

            // Let's save it! :-D
            save: function() {
                this.setMethod('PUT');

                var http = this.make(), that = this;

                if (this.hasOnSuccess())
                {
                    http.success(function(data, status, headers) {
                        that.getConfig().success(data, status, headers);
                    });
                }

                if (this.hasOnError())
                {
                    http.error(function(data, status, headers) {
                        that.getConfig().error(data, status, headers);
                    });
                }
            },

            create: function() {
                this.setMethod('POST');

                var http = this.make(), that = this;

                if (this.hasOnSuccess())
                {
                    http.success(function(data, status, headers) {
                        that.getConfig().success(data, status, headers);
                    });
                }

                if (this.hasOnError())
                {
                    http.error(function(data, status, headers) {
                        that.getConfig().error(data, status, headers);
                    });
                }
            },

            get: function(d) {
                this.setMethod('GET');

                var http = this.make(), that = this;

                if (this.hasOnSuccess())
                {
                    http.success(function(data, status, headers) {
                        that.getConfig().success(data, status, headers);
                    });
                }

                if (this.hasOnError())
                {
                    http.error(function(data, status, headers) {
                        that.getConfig().error(data, status, headers);
                    });
                }
            },

            delete: function() {
                this.setMethod('DELETE');

                var http = this.make(), that = this;

                if (this.hasOnSuccess())
                {
                    http.success(function(data, status, headers) {
                        that.getConfig().success(data, status, headers);
                    });
                }

                if (this.hasOnError())
                {
                    http.error(function(data, status, headers) {
                        that.getConfig().error(data, status, headers);
                    });
                }
            }
        });
        return Request;
    }
];