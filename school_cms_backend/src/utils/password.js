const bcrypt = require('bcrypt');

const hashPassword = async (rawPassword) => {
    return bcrypt.hash(rawPassword, 12); // hash returns a promise
}

module.exports = {hashPassword};