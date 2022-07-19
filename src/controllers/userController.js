const connection = require('../config/connection');
const securePassword = require('secure-password');
const pwd = securePassword();
const { 
    validateUserBody
} = require('../validators/userValidations');

const index = async (req, res) => {
    let { loggedUser } = req;

    try {
        return res.status(200).json(loggedUser);
    } catch (error) {
        return res.status(400).json({ 'mensagem': error.message });
    }
}

const create = async (req, res) => {
    const validators = validateUserBody(req.body);
    let { nome, email, senha } = req.body;

    if (validators.length > 0) {
        return res.status(400).json(validators);
    }

    try {
        const query = 'select * from usuarios where email = $1';
        const data = await connection.query(query, [email]);

        if (data.rowCount > 0) {
            return res.status(400).json({ 'mensagem': 'Este email já foi cadastrado' });
        }
    } catch (error) {
        return res.status(400).json({ 'mensagem': error.message });
    }

    try {
        const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
        const query = 'insert into usuarios (nome, email, senha) values ($1, $2, $3) RETURNING id, nome, email';
        const data = await connection.query(query, [nome, email, hash]);
        
        if (data.rowCount === 0) {
            return res.status(400).json({ 'mensagem': 'Não foi possivel cadastrar o usuário' });
        }

        const user = data.rows[0];

        return res.status(201).json(user);
    } catch (error) {
        return res.status(400).json({ 'mensagem': error.message });
    }
}

const update = async (req, res) => {
    const validators = validateUserBody(req.body);
    let { loggedUser } = req;
    let { nome, email, senha } = req.body;

    if (validators.length > 0) {
        return res.status(400).json(validators);
    }

    try {
        let data = await connection.query('select * from usuarios where email = $1',[email]);
        let user = data.rows[0];

        if (user && (user.id !== loggedUser.id)) {
            return res.status(403).json({ 'mensagem': 'O e-mail informado já está sendo utilizado' });
        }

        let hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
        data = await connection.query(
            'update usuarios set nome = $1, email = $2, senha = $3 where id = $4 RETURNING id, nome, email',
            [nome, email, hash, loggedUser.id]
        );
    
        const updatedUser = data.rows[0];

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(400).json({ 'mensagem': error.message });
    }
}

module.exports = {
    index,
    create,
    update
};
