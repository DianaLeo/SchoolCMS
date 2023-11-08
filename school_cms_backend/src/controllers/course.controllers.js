const NotFoundException = require('../exceptions/NotFoundException');
const Course = require('../models/course.models');
const Student = require('../models/student.models');
const Teacher = require('../models/teacher.models');
//const Joi = require('joi');

const getAllCourses = async (req, res) => {
    const courses = await Course.find().exec();
    res.json(courses);
};

const getCourseById = async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id).populate('students', 'firstname lastname email').exec();
    if (!course) {
        throw new NotFoundException('Course not found');
    }
    res.json(course);
};

const addCourse = async (req, res) => {
    // const schema = Joi.object({
    //     code: Joi.string()
    //         .uppercase()
    //         .regex(/^[a-zA-Z][a-zA-Z]-[a-zA-Z][a-zA-Z]-\d\d$/)
    //         .message('Invalid code format, expecting "xx-xx-00", x for a letter, 0 for a number')
    //         .required(),
    //     name: Joi.string().required(),
    //     description: Joi.string().optional(),
    // })
    // const validBody = await schema.validateAsync(req.body, {
    //     allowUnknown: true, // allow fields that are not defined in the Schema, won't throw errors
    //     stripUnknown: true, // don't process those unknown fields and delete them 
    // });

    const { code, name, description } = req.body;
    const course = new Course({ code, name, description });
    await course.save();
    res.json(course);
};

const updateCourseById = async (req, res) => {
    console.log('updating course');
    const { id } = req.params;
    const { name, description } = req.body;
    // findByIdAndUpdate sends request to MongoDB directly, skips Mongoose model validation
    // We have to open runValidators manually
    // only save() will call validation automatically
    const course = await Course.findByIdAndUpdate(
        id,
        { name, description },
        {
            new: true,
            runValidators: true
        }
    ).exec();
    if (!course) {
        throw new NotFoundException('Course not found');
    }
    res.json(course);
};

const deleteCourseById = async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id).exec();
    if (!course) {
        throw new NotFoundException('Course not found');
    }
    //remove course from students
    const students = course.students;
    // method 1
    // await Student.updateMany({ courses: id }, { $pull: { courses: id } })
    // method 2
    students.forEach(async (student) => {
        const studentId = student._id;
        await Student.findByIdAndUpdate(studentId,
            { $pull: { courses: id } }
        ).exec();
    })
    //remove course from teachers
    const teachers = course.teachers;
    teachers.forEach(async (teacher) => {
        const teacherId = teacher._id;
        await Teacher.findByIdAndUpdate(teacherId,
            { $pull: { courses: id } }
        ).exec();
    })
    await Course.findByIdAndDelete(id).exec();
    res.sendStatus(204);
};

module.exports = {
    getAllCourses,
    getCourseById,
    addCourse,
    updateCourseById,
    deleteCourseById
}