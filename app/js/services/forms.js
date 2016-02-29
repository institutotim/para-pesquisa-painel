/**
 * Created by luizfilipe on 10/12/14.
 */

module.exports = function(API) {
    var available_inputs = {
        RadioField: {
            name: 'FIELD_TYPE_RADIO',
            can_edit_options: true,
            available_layouts: [
                {name: 'FIELD_SIZE_SINGLE_COLUMN', type: 'single_column'},
                {name: 'FIELD_SIZE_MULTIPLE_COLUMNS', type: 'multiple_columns'}
            ],
            available_validations: []
        },

        TextField: {
            name: 'FIELD_TYPE_TEXT',
            can_edit_options: false,
            available_layouts: [
                {name: 'FIELD_SIZE_SMALL', type: 'small'},
                {name: 'FIELD_SIZE_MEDIUM', type: 'medium'},
                {name: 'FIELD_SIZE_LARGE', type: 'big'}
            ],
            available_validations: []
        },

        DatetimeField: {
            name: 'FIELD_TYPE_DATE',
            can_edit_options: false,
            available_layouts: [
                {name: 'FIELD_SIZE_SMALL', type: 'small'},
                {name: 'FIELD_SIZE_MEDIUM', type: 'medium'},
                {name: 'FIELD_SIZE_LARGE', type: 'big'}
            ],
            available_validations: []
        },

        CpfField: {
            name: 'FIELD_TYPE_CPF',
            can_edit_options: false,
            available_layouts: [
                {name: 'FIELD_SIZE_SMALL', type: 'small'},
                {name: 'FIELD_SIZE_MEDIUM', type: 'medium'},
                {name: 'FIELD_SIZE_LARGE', type: 'big'}
            ],
            available_validations: []
        },

        CheckboxField: {
            name: 'FIELD_TYPE_CHECKBOX',
            can_edit_options: true,
            available_layouts: [
                {name: 'FIELD_SIZE_SINGLE_COLUMN', type: 'single_column'},
                {name: 'FIELD_SIZE_MULTIPLE_COLUMNS', type: 'multiple_columns'}
            ],
            available_validations: []
        },

        EmailField: {
            name: 'FIELD_TYPE_EMAIL',
            can_edit_options: false,
            available_layouts: [
                {name: 'FIELD_SIZE_SMALL', type: 'small'},
                {name: 'FIELD_SIZE_MEDIUM', type: 'medium'},
                {name: 'FIELD_SIZE_LARGE', type: 'big'}
            ],
            available_validations: []
        },

        PrivateField: {
            name: 'FIELD_TYPE_PRIVATE',
            can_edit_options: false,
            available_layouts: [
                {name: 'FIELD_SIZE_SMALL', type: 'small'},
                {name: 'FIELD_SIZE_MEDIUM', type: 'medium'},
                {name: 'FIELD_SIZE_LARGE', type: 'big'}
            ],
            available_validations: []
        },

        NumberField: {
            name: 'FIELD_TYPE_NUMBER',
            can_edit_options: false,
            available_layouts: [
                {name: 'FIELD_SIZE_SMALL', type: 'small'},
                {name: 'FIELD_SIZE_MEDIUM', type: 'medium'},
                {name: 'FIELD_SIZE_LARGE', type: 'big'}
            ],
            available_validations: []
        },

        OrderedlistField: {
            name: 'FIELD_TYPE_SELECT_DRAGGABLE',
            can_edit_options: true,
            available_layouts: [
            ],
            available_validations: []
        },

        UrlField: {
            name: 'FIELD_TYPE_URL',
            can_edit_options: false,
            available_layouts: [
                {name: 'FIELD_SIZE_SMALL', type: 'small'},
                {name: 'FIELD_SIZE_MEDIUM', type: 'medium'},
                {name: 'FIELD_SIZE_LARGE', type: 'big'}
            ],
            available_validations: []
        },

        SelectField: {
            name: 'FIELD_TYPE_SELECT',
            can_edit_options: true,
            available_layouts: [],
            available_validations: []
        },

        LabelField: {
            name: 'FIELD_TYPE_LABEL',
            can_edit_options: false,
            available_layouts: [
            ],
            available_validations: []
        },

        DinheiroField: {
            name: 'FIELD_TYPE_REAL',
            can_edit_options: false,
            available_layouts: [],
            available_validations: []
        }
    };

    return {
        getAll: function(success, error) {
            API('GET', '/forms?as=collection').success(function(data) {
                success(data);
            }).error(function() {
                error();
            });
        },

        get: function(id, success, error) {
            API('GET', '/forms/' + id).success(function(data) {
                success(data);
            }).error(function() {
                error();
            });
        },

        create: function(data, success, error) {
            API('POST', '/forms', true, data).success(function(data) {
                success(data);
            }).error(function() {
                error(data);
            });
        },

        update: function(id, data, success, error) {
            API('PUT', '/forms/' + id, true, data).success(function(data) {
                success(data);
            }).error(function() {
                error(data);
            });
        },

        delete: function(id, success, error) {
            API('DELETE', '/forms/' + id).success(function() {
                success();
            }).error(function() {
                error();
            });
        },

        /* assignments */
        get_all_assignments: function(id, success, error) {
            return API('GET', '/forms/' + id + '/assignments?as=collection').
                success(function(data) {
                    success(data);
                }).error(function() {
                    error();
                });
        },

        create_assignment: function(form_id, data, success, error) {
            return API('POST', '/forms/' + form_id + '/assignments', true, data).
                success(function(data) {
                    success(data);
                }).error(function() {
                    error(data);
                });
        },

        update_assignment: function(form_id, id, data, success, error) {
            API('PUT', '/forms/' + form_id + '/assignments/' + id, true, data).
                success(function(data) {
                    success(data);
                }).error(function() {
                    error(data);
                });
        },

        delete_assignment: function(form_id, id, success, error) {
            API('DELETE', '/forms/' + form_id + '/assignments/' + id).
                success(function(data) {
                    success(data);
                }).error(function() {
                    error(form_id, id);
                });
        },

        /* stop reasons */
        create_reason: function(form_id, data, success, error) {
            API('POST', '/forms/' + form_id + '/stop_reasons', true, data).
                success(function(data) {
                    success(data);
                }).error(function() {
                    error(data);
                });
        },

        delete_reason: function(form_id, id, success, error) {
            API('DELETE', '/forms/' + form_id + '/stop_reasons/' + id).
                success(function() {
                    success();
                }).error(function() {
                    error();
                });
        },

        /* form sessions */
        update_sections: function(form_id, data, success, error) {
            API('PUT', '/forms/' + form_id + '/sections', true, data).
                success(function(data) {
                    success(data);
                }).error(function() {
                    error(data);
                });
        },

        create_section: function(form_id, data, success, error) {
            API('POST', '/forms/' + form_id + '/sections', true, data).
                success(function(data) {
                    success(data);
                }).error(function() {
                    error(data);
                });
        },

        update_section: function(form_id, id, data, success, error) {
            API('PUT', '/forms/' + form_id + '/sections/' + id, true, data).
                success(function(data) {
                success(data);
            }).error(function() {
                error(data);
            });
        },

        delete_section: function(form_id, id, success, error) {
            API('DELETE', '/forms/' + form_id + '/sections/' + id).success(function(data, status, headers) {
                success();
            }).error(function(data, status, headers) {
                error();
            });
        },

        /* form fields inside sections */
        update_section_fields: function(form_id, section_id, data, success, error) {
            API('PUT', '/forms/' + form_id + '/sections/' + section_id + '/fields', true, data).success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error(data);
            });
        },

        create_section_field: function(form_id, section_id, data, success, error) {
            API('POST', '/forms/' + form_id + '/sections/' +  section_id + '/fields', true, data).success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error(data);
            });
        },

        update_section_field: function(form_id, section_id, id, data, success, error) {
            API('PUT', '/forms/' + form_id + '/sections/' + section_id + '/fields/' + id, true, data).success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error(data);
            });
        },

        delete_section_field: function(form_id, section_id, id, success, error) {
            API('DELETE', '/forms/' + form_id + '/sections/' + section_id + '/fields/' + id).success(function(data, status, headers) {
                success();
            }).error(function(data, status, headers) {
                error();
            });
        },

        import_csv: function(form_id, job_id, data, success, error) {
            API('POST', '/forms/' + form_id + '/import_csv/' +  job_id, true, data).success(function(data, status, headers) {
                success(data);
            }).error(function() {
                error(data);
            });
        },

        getAvailableInputs: function() {
            return available_inputs;
        },
    }
}