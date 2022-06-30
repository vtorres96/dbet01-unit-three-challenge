const connection = require('../config/connection');

const checkIfTransactionBelongsUser = async (transactionId, loggedUserId) => {
    let transactionData = [];

    try {
        const query = `
            select t.*, c.descricao as categoria_nome from transacoes t
            inner join categorias c on (t.categoria_id = c.id)
            where t.id = $1 and t.usuario_id = $2`;
        const data = await connection.query(query, [transactionId, loggedUserId]);

        if (data.rowCount > 0) {
            transactionData = data.rows[0];
        }

        return transactionData;
    } catch (error) {
        return transactionData.push({ 'error': error.message });;
    }
}

const getTransactionsByUserId = async (loggedUserId) => {
    let transactionsData = [];

    try {
        const query = `
            select * from transacoes
            where usuario_id = $1`;
        const data = await connection.query(query, [loggedUserId]);

        if (data.rowCount > 0) {
            transactionsData = data.rows;
        }

        return transactionsData;
    } catch (error) {
        return transactionData.push({ 'error': error.message });;
    }
}

module.exports = { 
    checkIfTransactionBelongsUser,
    getTransactionsByUserId
};