const connection = require('../config/connection');

const checkIfCategorieExists = async (categoryId) => {
    let categorieData = [];

    try {
        const query = 'select * from categorias where id = $1';
        const data = await connection.query(query, [categoryId]);

        if (data.rowCount > 0) {
            categorieData = data.rows[0];
        }

        return categorieData;
    } catch (error) {
        return categorieData.push({ 'error': error.message });
    }
}

module.exports = { 
    checkIfCategorieExists
};