const mongoose = require('mongoose');

//return a Promise
const connectToDB = async ()=>{
    const connectionString = process.env.CONNECTION_STRING;
    if (!connectionString){
        console.log('CONNECTION_STRING is not defined');
        //normal exit 0
        //abnomal exit !0
        process.exit(1);
        //already exited, doesn't need a 'return'
    }

    //settings
    const db = mongoose.connection;
    db.on('error',(e)=>{
        console.log(e);
        process.exit(2);
    });
    db.on('connected',()=>{
        console.log('DB connected.');
    });
    db.on('disconnected',()=>{
        console.log('DB disconnected');
        //Doesn't need a exit here, because mongoose has a reconnect machanism
    });

    //'mongoose.connect' returns a promise
    //So it should be 'const result = await mongoose.connect(connectionString)'
    //But because it is a return, and async returns a promise as well
    //we can omit the async-await
    return mongoose.connect(connectionString);
}

module.exports = connectToDB;