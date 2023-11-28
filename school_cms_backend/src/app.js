const express = require('express');
const cors = require('cors');
require('express-async-errors');
const v1Router = require('./routes');
const unknownError = require('./middlewares/error/unknownError');
const validationError = require('./middlewares/error/validationError');
const notFoundError = require('./middlewares/error/notFoundError');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/v1', v1Router);

app.use(validationError);
app.use(notFoundError);
app.use(unknownError);

module.exports = app
