const jwt = require('jsonwebtoken');

//secret
const secret = 'secret'; //process.env.JWT_SECRET;

const generateToken = (payload) => {
    return jwt.sign(payload, secret, { expiresIn: '1d' });
}

const validateToken = (token) => {
    //return jwt.verify(token, secret);
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        return null;
    }
}

module.exports = { generateToken, validateToken };