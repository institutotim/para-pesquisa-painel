/**
 * Created by luizfilipe on 10/12/14.
 */

module.exports = function(Request) {

    var submission, submission_s;

    var Submission = function(s, f) {
        if (typeof s == 'object')
        {
            submission = s;
            submission_s = {}; // empty object, all new data will be stored here for PUT/POST
        }

        // if @s is an id, it means we need to get a specific submission
        if (typeof s == 'string')
        {
            submission = {id: s, form_id: f};
        }
    };

    Submission.prototype.fetch = function(options) {
        var req = new Request();

        req.path('/forms/' + options.form + '/submissions');
        req.fromPage(options.page);

        if (typeof options.search !== 'undefined' && options.search !== null && options.search !== '')
        {
            req.addParam('identifier_like', options.search);
        }

        if (typeof options.user !== 'undefined' && options.user !== null)
        {
            req.path('/forms/' + options.form + '/users/' + options.user + '/submissions');
            req.addParam('as', 'paginated_collection');
        }

        if (typeof options.status !== 'undefined' && options.status !== null)
        {
            req.addParam('by_status', options.status);
        }

        if (typeof options.updated_between !== 'undefined')
        {
            req.updated_between(options.updated_between);
        }

        // If it is still in page 1, it's not a "scrolling" request
        if (options.infiniteScrolling === true && options.page == 1)
        {
            options.infiniteScrolling = false;
        }

        req.onSuccess(function(data, status, headers) {
            if (options.infiniteScrolling !== true)
            {
                options.success(data.response, data.pagination.count);
            }
            else
            {
                if (data.pagination.next == null) {
                    options.infiniteScrollingSuccess(data.response, true, data.pagination.count);

                    return;
                }

                options.infiniteScrollingSuccess(data.response, false, data.pagination.count);
            }
        });

        req.onError(function() {
            alert('error! :-(');
        });

        req.get();
    };

    Submission.prototype.get = function(options) {
        var req = new Request();

        req.path('/forms/' + submission.form_id + '/submissions/' + submission.id);

        req.onSuccess(function(data, status, headers) {
            options.success(data.response);
        });

        req.get();
    };

    Submission.prototype.set = function(key, value) {
        submission_s[key] = value;
    };

    Submission.prototype.save = function(success) {
        var req = new Request();

        req.path('/forms/' + submission.form_id + '/submissions/' + submission.id);
        req.setData(submission_s);

        req.onSuccess(function(data, status, headers) {
            success(data.response);
        });

        req.save();
    };

    Submission.prototype.delete = function(options) {
        var req = new Request();

        req.path('/submissions/' + submission.id);

        req.onSuccess(function(data, status, headers) {
            options.success(data.response);
        });

        req.delete();
    };

    Submission.prototype.reset = function(success) {
        var req = new Request();

        req.path('/forms/' + submission.form_id + '/submissions/' + submission.id + '/reset');
        req.setMethod('POST');

        var http = req.make();

        http.success(function(data, status, headers) {
            success(data.response);
        });
    };

    Submission.prototype.transfer = function(options) {
        var req = new Request();

        req.path('/forms/' + submission.form_id + '/submissions/transfer');
        req.setData({
            user_id_from: options.from,
            user_id_to: options.to
        });

        req.onSuccess(function(data, status, headers) {
            options.success(data.response);
        });

        req.create();
    };

    return Submission;
};