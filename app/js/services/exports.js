/**
 * Created by luizfilipe on 10/12/14.
 */

module.exports = function(Request) {

    var _export;

    var Export = function(s) {
        // if @s is an id, it means we need to get a specific submission
        if (typeof s == 'string')
        {
            _export = {id: s};
        }
    };

    Export.prototype.fetch = function(options) {
        var req = new Request();

        req.path('/exports');

        req.onSuccess(function(data, status, headers) {
            options.success(data.response);
        });

        req.onError(function() {
            alert('error! :-(');
        });

        req.get();
    };

    Export.prototype.getProgress = function(options) {
        var req = new Request();

        req.path('/export/progress/' + options.job_id);

        req.onSuccess(function(data, status, headers) {
            options.success(data.response);
        });

        req.onError(function() {
            console.log('Não foi possível buscar o progresso da exportação. Por favor, tente novamente.');
            options.error();
        });

        req.get();
    };

    Export.prototype.create = function(options) {
        var req = new Request();

        var data = {};

        switch (options.method)
        {
            case 'users':
                req.path('/users/export/csv');

                if (typeof options.role !== 'undefined' && options.role !== null)
                {
                    data.by_role = options.role;
                }
                break;

            case 'forms':
                req.path('/forms/export/csv');
                break;

            case 'fields':
                req.path('/fields/export/csv');
                break;

            case 'submissions':
                req.path('/forms/' + options.form_id + '/submissions/export/csv');

                if (typeof options.status !== 'undefined' && options.status !== null)
                {
                    data.by_status = options.status;
                }

                if (typeof options.updated_between !== 'undefined')
                {
                    if (options.updated_between[0] !== null)
                    {
                        data.updated_from = options.updated_between[0];
                    }

                    if (options.updated_between[1] !== null)
                    {
                        data.updated_to = options.updated_between[1];
                    }
                }
                break;

            case 'answers':
                req.path('/forms/' + options.form_id + '/submissions/answers/export/csv');

                if (typeof options.status !== 'undefined' && options.status !== null)
                {
                    data.by_status = options.status;
                }

                if (typeof options.updated_between !== 'undefined')
                {
                    if (options.updated_between[0] !== null)
                    {
                        data.updated_from = options.updated_between[0];
                    }

                    if (options.updated_between[1] !== null)
                    {
                        data.updated_to = options.updated_between[1];
                    }
                }
                break;
        }

        if (typeof options.include_header !== 'undefined' && options.include_header !== null)
        {
            data.include_header = options.include_header;
        }

        req.setData(data);

        req.onSuccess(function(data, status, headers) {
            options.success(data.response.job_id);
        });

        req.onError(function(data, status, headers) {
            options.error();
        });

        req.create();
    };

    Export.prototype.delete = function(options) {
        var req = new Request();

        req.path('/exports/' + _export.id);

        req.onSuccess(function(data, status, headers) {
            options.success(data.response);
        });

        req.delete();
    };

    return Export;
};