const { Schema, model } = require('mongoose');

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
        //validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
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