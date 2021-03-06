/**
 * Created by luizfilipe on 10/12/14.
 */


module.exports = function(Request) {
    var assignment, assignment_s;

    var Assignment = function() {};

    Assignment.prototype.fetchAll = function(options) {
        var req = new Request();

        req.path('/forms/' + options.form_id + '/assignments');
        req.fromPage(options.page);

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

    return Assignment;
};