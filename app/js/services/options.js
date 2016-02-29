/**
 * Created by luizfilipe on 10/12/14.
 */

module.exports = function() {
    var available_texts_for_inject = {
        br_states: [
            'Acre',
            'Alagoas',
            'Amazonas',
            'Amapá',
            'Bahia',
            'Ceará',
            'Distrito Federal',
            'Espírito Santo',
            'Goiás',
            'Maranhão',
            'Minas Gerais',
            'Mato Grosso do Sul',
            'Mato Grosso',
            'Pará',
            'Paraíba',
            'Pernambuco',
            'Piauí',
            'Paraná',
            'Rio de Janeiro',
            'Rio Grande do Norte',
            'Rondônia',
            'Roraima',
            'Rio Grande do Sul',
            'Santa Catarina',
            'Sergipe',
            'São Paulo',
            'Tocantins'
        ]
    };

    return {
        getOptionsForInject: function(var_name)
        {
            return available_texts_for_inject[var_name];
        }
    };
};
