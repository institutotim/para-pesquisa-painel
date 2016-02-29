/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function(Request) {
    var user, user_s;

    var User = function(s) {
        if (typeof s == 'object')
        {
            user = s;
            user_s = {}; // empty object, all new data will be stored here for PUT/POST
        }

        // if @s is an id, it means we need to get a specific user
        if (typeof s == 'string' || typeof s == 'number')
        {
            user = {id: s};
        }
    };

    User.prototype.fetchAll = function(options) {
        var req = new Request();

        req.path('/users');
        req.fromPage(options.page);

        if (typeof options.search !== 'undefined' && options.search !== null && options.search !== '')
        {
            req.addParam('name_like', options.search);
        }

        if (typeof options.no_pagination !== 'undefined' && options.no_pagination == true)
        {
            req.addParam('as', 'collection');
        }

        // If it is still in page 1, it's not a "scrolling" request
        if (options.infiniteScrolling === true && options.page == 1)
        {
            options.infiniteScrolling = false;
        }

        req.onSuccess(function(data, status, headers) {
            if (options.infiniteScrolling !== true)
            {
                options.success(data.response);
            }
            else
            {
                if (data.pagination.next == null) {
                    options.infiniteScrollingSuccess(data.response, true);

                    return;
                }

                options.infiniteScrollingSuccess(data.response);
            }
        });

        req.onError(function() {
            alert('error! :-(');
        });

        req.get();
    };

    User.prototype.delete = function(options) {
        var req = new Request();

        req.path('/users/' + user.id);

        req.onSuccess(function(data, status, headers) {
            options.success(data.response);
        });

        req.onError(function() {
            alert('error! :-(');
        });

        req.delete();
    };

    return User;
};