const { Schema, model } = require('mongoose');

module.exports = model('Course', new Schema({
    code: {
        type: String,
        match: [/^[a-zA-Z][a-zA-Z]-[a-zA-Z][a-zA-Z]-\d\d$/, 'Invalid code format, expecting "xx-xx-00", x for a letter, 0 for a number'],
        required: [true, 'Course code is required'],
        uppercase: true,
        unique:[true, 'This code is already taken.'],
    },
    name: {
        type: String,
        required: [true, 'Course name is required'],
    },
    description: {
        type: String,
        default: "Course description",
    },
    //one to one
    // student:
    // {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Student',
    // },
    //one to many
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student', // same with student model
        }
    ],
    teachers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Teacher',
        }
    ]
},
    { timestamps: true, }
));