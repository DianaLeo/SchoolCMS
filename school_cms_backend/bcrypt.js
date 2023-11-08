// this file is for testing bcrypt features
const bcrypt = require('bcrypt');

const password = '123';

const hashedPassword = bcrypt.hashSync(password,10);
console.log(hashedPassword);

//const salt = bcrypt.genSaltSync(12);
const salt = '$2b$12$6L6IEiirLO3P4f6zRsAVpu'
console.log(salt);

const hashedPassword2 = bcrypt.hashSync(password,salt);
console.log(hashedPassword2);