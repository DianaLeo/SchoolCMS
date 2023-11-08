const { Schema, model } = require('mongoose');
const Joi = require('joi');

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

//data format
const studentSchema = new Schema({
    firstname: {
        type: String,
        required: [true, 'Firstname is required'],
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is required'],
    },
    email: {
        type: String,
        //method 1:
        //validate: [validateEmail, 'Please fill a valid email address'],
        //method 2:
        //match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        //method 3:
        validate:[
            {
                validator:email=>{
                    return Joi.string().email().validate(email).error === undefined;
                },
                msg:'Invalid email format',
            }
        ]
    },
    courses: [
        {
            type: String,
            ref: 'Course',
        }
    ]
}, {
    timestamps: true
}
)

//collection students
const Student = model('Student', studentSchema);

module.exports = Student;