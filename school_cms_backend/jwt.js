// this file is for testing how jwt works
const jwt = require('jsonwebtoken');

// secret -> only store in server -> read from env variable
const secret = 'secret';

// what can put in payload? non-sensitive info, not email
const payload = {
    id: 123,
    name: 'john',
    role:'',
    avatar:''
}

//pros: user don't have to send a lot of request to fetch his/her info
//cons: occupies more resources

// m->minute, d->day
// access token -> 1d, 7d, 30d
// refresh token (30d-1y) -> access token expires shorter -> 15m, 1d
const token = jwt.sign(payload, secret, { expiresIn: '1m' });

console.log(token);

try {
    const decoded = jwt.verify(token, secret);
    console.log(decoded); //payload
} catch (error) {
    console.log(error);
}
