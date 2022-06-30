const validateTransactionBody = ({
    tipo, descricao, valor, data, categoria_id 
}) => {
    const validators = [];

    if (!tipo) {
        validators.push({ 'mensagem': 'O campo tipo é obrigatório' });
    }

    if (!descricao) {
        validators.push({ 'mensagem': 'O campo descricao é obrigatório' });
    }

    if (!valor) {
        validators.push({ 'mensagem': 'O campo valor é obrigatório' });
    }

    if (!data) {
        validators.push({ 'mensagem': 'O campo data é obrigatório' });
    }

    if (!categoria_id) {
        validators.push({ 'mensagem': 'O campo categoria_id é obrigatório' });
    }

    return validators;
}

const validateIfTransactionTypeIsValid = (type) => {
    return type === 'entrada' || type === 'saida';
}

module.exports = { 
    validateTransactionBody,
    validateIfTransactionTypeIsValid
};