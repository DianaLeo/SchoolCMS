const { Schema, model } = require('mongoose');

module.exports = model('Teacher', new Schema({
    firstname: {
        type: String,
        required: [true,'Firstname is required'],
    },
    lastname: {
        type: String,
        required: [true,'Lastname is required'],
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    courses:[
        {
            type:String,
            ref: 'Course',
        }
    ]
}, {
    timestamps: true
}));