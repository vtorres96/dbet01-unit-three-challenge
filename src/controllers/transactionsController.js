const connection = require('../config/connection');
const { 
    validateTransactionBody,
    validateIfTransactionTypeIsValid
} = require('../validators/transactionValidations');
const { checkIfCategorieExists } = require('../services/categorieService');
const { 
    checkIfTransactionBelongsUser,
    getTransactionsByUserId
} = require('../services/transactionService');

const index = async (req, res) => {
    let { loggedUser } = req;

    try {
        const query = 'select * from transacoes where usuario_id = $1'
        const data = await connection.query(query, [loggedUser.id]);
        const transactions = data.rows;

        return res.status(200).json(transactions);
    } catch (error) {
        return res.status(400).json({ 'mensagem': error.message });
    }
}

const getById = async (req, res) => {
    let { loggedUser } = req;
    let { id } = req.params;

    const transactionData = await checkIfTransactionBelongsUser(
        id,
        loggedUser.id
    );

    if (
        Array.isArray(transactionData) &&
        transactionData.some(element => element.hasOwnProperty('error'))
    ) {
        return res.status(400).json({ 'erro': transactionData[0].error }); 
    }

    if (transactionData.length === 0) {
        return res.status(400).json({ 'mensagem': 'Transação não encontrada' });
    }

    return res.status(200).json(transactionData);
}

const create = async (req, res) => {
    const validators = validateTransactionBody(req.body);
    let { loggedUser } = req;
    let { tipo, descricao, valor, data, categoria_id } = req.body;

    if (validators.length > 0) {
        return res.status(400).json(validators);
    }

    if (!validateIfTransactionTypeIsValid(tipo)) {
        return res.status(400).json({ 'mensagem': 'O tipo da transação informada é inválido' });
    }

    const categorieData = await checkIfCategorieExists(categoria_id);

    if (
        Array.isArray(categorieData) && 
        categorieData.some(element => element.hasOwnProperty('error'))
    ) {
        return res.status(400).json({ 'erro': categorieData[0].error }); 
    }

    if (categorieData.length === 0) {
        return res.status(400).json({ 'mensagem': 'O ID da categoria informada não existe' });
    }

    try {
        const query = 'insert into transacoes (tipo, descricao, valor, data, categoria_id, usuario_id) values ($1, $2, $3, $4, $5, $6) RETURNING *';
        const transactionData = await connection.query(query, [tipo, descricao, valor, data, categoria_id, loggedUser.id]);
        
        if (transactionData.rowCount === 0) {
            return res.status(400).json({ 'mensagem': 'Não foi possivel cadastrar a transação' });
        }

        const transaction = transactionData.rows[0];
        const result = {
            ...transaction,
            categoria_nome: categorieData.descricao,
        }

        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ 'mensagem': error.message });
    }
}

const update = async (req, res) => {
    const validators = validateTransactionBody(req.body);
    let { loggedUser } = req;
    let { tipo, descricao, valor, data, categoria_id } = req.body;
    let { id } = req.params;
    
    if (validators.length > 0) {
        return res.status(400).json(validators);
    }

    if (!validateIfTransactionTypeIsValid(tipo)) {
        return res.status(400).json({ 'mensagem': 'O tipo da transação informada é inválido' });
    }

    const categorieData = await checkIfCategorieExists(categoria_id);

    if (
        Array.isArray(categorieData) && 
        categorieData.some(element => element.hasOwnProperty('error'))
    ) {
       return res.status(400).json({ 'erro': categorieData[0].error }); 
    }
    
    if (categorieData.length === 0) {
        return res.status(400).json({ 'mensagem': 'O ID da categoria informada não existe' });
    }
 
    const transactionData = await checkIfTransactionBelongsUser(
        id,
        loggedUser.id
    );
    
    if (
        Array.isArray(transactionData) &&
        transactionData.some(element => element.hasOwnProperty('error'))
    ) {
        return res.status(400).json({ 'erro': transactionData[0].error }); 
    }

    if (transactionData.length === 0) {
        return res.status(400).json({ 'mensagem': 'Transação não encontrada' });
    }

    try {
        const query = 'update transacoes set tipo = $1, descricao = $2, valor = $3, data = $4, categoria_id = $5 RETURNING *';
        const transactionData = await connection.query(query, [tipo, descricao, valor, data, categoria_id]);
        
        if (transactionData.rowCount === 0) {
            return res.status(400).json({ 'mensagem': 'Não foi possivel atualizar a transação' });
        }

        const transaction = transactionData.rows[0];
        const result = {
            ...transaction,
            categoria_nome: categorieData.descricao,
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ 'mensagem': error.message });
    }
}

const remove = async (req, res) => {
    let { loggedUser } = req;
    let { id } = req.params;

    const transactionData = await checkIfTransactionBelongsUser(
        id,
        loggedUser.id
    );

    if (
        Array.isArray(transactionData) &&
        transactionData.some(element => element.hasOwnProperty('error'))
    ) {
        return res.status(400).json({ 'erro': transactionData[0].error }); 
    }
    
    if (transactionData.length === 0) {
        return res.status(400).json({ 'mensagem': 'Transação não encontrada' });
    }

    try {
        const query = 'delete from transacoes where id = $1';
        const transactionData = await connection.query(query, [id]);

        if (transactionData.rowCount > 0) {
            return res.status(200).json({ 'mensagem': 'Transação excluída com sucesso' });
        }

        return res.status(200).json({ 'mensagem': 'Não foi possível excluir a transação' });
    } catch (error) {
        return res.status(400).json({ 'mensagem': error.message });
    }
}

const extract = async (req, res) => {
    let { loggedUser } = req;
    let entrada = 0;
    let saida = 0;

    const transactionsData = await getTransactionsByUserId(loggedUser.id);
    
    if (transactionsData.some(element => element.hasOwnProperty('error'))) {
        return res.status(400).json({ 'erro': transactionsData[0].error }); 
    }

    if (transactionsData.length === 0) {
        return res.status(400).json({ 'mensagem': 'O usuário não possui transações para serem exibidas no extrato' });
    }

    transactionsData.forEach(transaction => {
        if (transaction.tipo == "entrada") {
            entrada += transaction.valor;
        } else {
            saida += transaction.valor;
        }
    });

    return res.status(200).json({
        entrada,
        saida
    });
}

module.exports = {
    index,
    getById,
    create,
    update,
    remove,
    extract
};