const { Pool } = require('pg');

const pool = new Pool({
    user: 'bdovawkqjscghh',
    host: 'ec2-3-222-74-92.compute-1.amazonaws.com',
    database: 'd7tgfd3lkr5lq',
    password: '92ca49ddc62679b20cb1052ba9c12af9c4cac24fa5fe22ecb2e1e69e55bbe295',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

const query = (text, param) => {
    return pool.query(text, param);
}

module.exports = {
    query
}