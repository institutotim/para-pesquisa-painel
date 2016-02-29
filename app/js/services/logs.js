/**
 * Created by luizfilipe on 10/12/14.
 */

module.exports = function(Request) {

    var log;

    var Logs = function(s) {
        if (typeof s == 'object')
        {
            log = s;
        }
    };

    Logs.prototype.fetchAll = function(options) {
        var req = new Request();

        req.path('/logs');
        req.fromPage(options.page);

        if (typeof options.updated_between !== 'undefined')
        {
            req.updated_between(options.updated_between);
        }

        if (typeof options.user !== 'undefined' && options.user !== null)
        {
            req.path('/users/' + options.user + '/logs');
            req.addParam('as', 'paginated_collection');
        }

        // If it is still in page 1, it's not a "scrolling" request
        if (options.infiniteScrolling === true && options.page == 1)
        {
            options.infiniteScrolling = false;
        }

        req.onSuccess(function(data, status, headers) {
            if (options.infiniteScrolling !== true)
            {
                options.success(data.response, data.count);
            }
            else
            {
                if (data.pagination.next == null) {
                    options.infiniteScrollingSuccess(data.response, data.count, true);

                    return;
                }

                options.infiniteScrollingSuccess(data.response, data.count);
            }
        });

        req.onError(function() {
            alert('error! :-(');
        });

        req.get();
    };

    return Logs;
};