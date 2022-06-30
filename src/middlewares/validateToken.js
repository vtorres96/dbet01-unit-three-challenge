const connection = require('../config/connection');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../secret');

const validateToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization){
        res.status(401).json({ 'mensagem': 'Para acessar este recurso um token de autenticação válido deve ser enviado.'});
    }

    try {
        let token = authorization.replace('Bearer ', "").trim();
        req.loggedUser = jwt.verify(token, jwtSecret);

        next();
    } catch (error) {
        return res.status(400).json({ 'mensagem': error.message });
    }
}

module.exports = {
    validateToken
}
