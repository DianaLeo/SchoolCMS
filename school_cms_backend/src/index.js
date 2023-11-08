require('dotenv').config ();
const connectToDB = require('./utils/db');
const app = require('./app');

const PORT = process.env.PORT || 8000;

//Make sure we connect to DB first
connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    })
});

