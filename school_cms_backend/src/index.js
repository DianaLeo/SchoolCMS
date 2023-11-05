require('dotenv').config ();
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const v1Router = require('./routes');
const connectToDB = require('./utils/db');
const unknownError = require('./middlewares/error/unknownError');
const validationError = require('./middlewares/error/validationError');
const notFoundError = require('./middlewares/error/notFoundError');

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/v1', v1Router);

app.use(validationError);
app.use(notFoundError);
app.use(unknownError);

//Make sure we connect to DB first
connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    })
});

