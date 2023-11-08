const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// User related operations:
// - User profile update
// - User signIn login
// So there will be two routes: /users and /auth
const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, //mongoose level create unique index in mongodb
    },
    password: {
        type: String,
        required: true,
    },
});

// Customize a generate hashPassword function for register
// How to call it? inside controller: userDocument.hashPassword();
schema.methods.hashPassword = async function () {
    this.password = await bcrypt.hash(this.password, 12); // hash returns a promise
};
// Customize a validatePassword function for login
schema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = model('User', schema);