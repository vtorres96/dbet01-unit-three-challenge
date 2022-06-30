const validateUserBody = ({
    nome, email, senha
}) => {
    const validators = [];

    if (!nome) {
        validators.push({ 'mensagem': 'O campo nome é obrigatório' });
    }

    if (!email) {
        validators.push({ 'mensagem': 'O campo email é obrigatório' });
    }

    if (!senha) {
        validators.push({ 'mensagem': 'O campo senha é obrigatório' });
    }

    return validators;
}

module.exports = { 
    validateUserBody
};