const Student = require('../models/student.models');
const Course = require('../models/course.models');
const NotFoundException = require('../exceptions/NotFoundException');

const getAllStudents = async (req, res) => {
    const students = await Student.find().exec();
    res.json(students);
}

const getStudentById = async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id).populate('courses', 'name description teachers').exec();
    if (!student) {
        throw new NotFoundException('Student not found')
    }
    res.json(student);
}

const addStudents = async (req, res) => {
    console.log('Adding student');
    const { firstname, lastname, email } = req.body;
    const student = new Student({
        firstname, lastname, email
    });
    await student.save();
    res.status(201).json(student);
}

const updateStudentById = async (req, res) => {
    console.log('Updating student');
    const { id } = req.params;
    const { firstname, lastname, email } = req.body;
    //findByIdAndUpdate automatically check input data
    //if there is an undefined, this field won't be updated
    const student = await Student.findByIdAndUpdate(
        id,
        { firstname, lastname, email },
        {
            new: true,
            runValidators: true//only save() will call validation automatically
        }
    ).exec();
    if (!student) {
        throw new NotFoundException('Student not found')
    }
    res.json(student);
}

const deleteStudentById = async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id).exec();
    if (!student) {
        throw new NotFoundException('Student not found')
    }
    const courses = student.courses;
    courses.forEach(async (course) => {
        const courseId = course.code;
        await Course.findByIdAndUpdate(courseId,
            { $pull: { students: id } }
        ).exec();
    })
    await Student.findByIdAndDelete(id).exec();
    res.sendStatus(204);
}




//Add and remove Student to/from Course. Can be done in course.controllers.js as well

// /v1/students/:studentId/courses/:courseId
// find student by id
// find course by id
// validate student and course exist
// add course to student
// add student to course
// save student
// save course
const addStudentToCourse = async (req, res) => {
    const { studentId, courseId } = req.params;
    const student = await Student.findById(studentId).exec();
    const course = await Course.findById(courseId).exec();
    // Mongoose returns undefined if student/course not found, instead of throwing an error
    if (!student || !course) {
        throw new NotFoundException('Student or course not found')
    }
    // can add transaction, but MongoDB doesn't support transactions in dev mode

    //method 1 : student.courses.push(courseId);
    //method 2
    // can avoid duplicate courseID
    student.courses.addToSet(courseId);
    course.students.addToSet(studentId);

    await student.save();
    await course.save();

    //or combine add and save into one step using findbyidandupdate
    // await Student.findByIdAndUpdate(studentId,{
    //     $addToSet:{courses:courseId}
    // }).exec();
    // await Course.findByIdAndUpdate(courseId,{
    //     $addToSet:{students:studentId}
    // }).exec();

    res.json(student);
}

// /v1/students/:studentId/courses/:courseId
const removeStudentFromCourse = async (req, res) => {
    const { studentId, courseId } = req.params;
    const student = await Student.findById(studentId).exec();
    const course = await Course.findById(courseId).exec();
    if (!student || !course) {
        throw new NotFoundException('Student or course not found')
    }

    //student.courses.pull(courseId);
    //course.students.pull(studentId);
    //await student.save();
    //await course.save();

    await Student.findByIdAndUpdate(studentId,
        { $pull: { courses: courseId } }
    ).exec();
    await Course.findByIdAndUpdate(courseId,
        { $pull: { students: studentId } }
    ).exec();

    res.sendStatus(204);
}

module.exports = {
    getAllStudents,
    getStudentById,
    addStudents,
    updateStudentById,
    deleteStudentById,
    addStudentToCourse,
    removeStudentFromCourse
}
