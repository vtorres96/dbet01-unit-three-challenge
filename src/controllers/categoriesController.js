const connection = require('../config/connection');

const index = async (req, res) => {
    try {
        const data = await connection.query('select * from categorias');
                
        if (data.rowCount === 0) {
            return res.status(400).json({ 'mensagem': 'Não existem categorias' });
        }

        const categories = data.rows;

        return res.status(200).json(categories);
    } catch (error) {
        return res.status(400).json({ 'mensagem': error.message });
    }
}

module.exports = {
    index
};