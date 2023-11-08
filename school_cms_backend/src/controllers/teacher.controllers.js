const Teacher = require('../models/teacher.models');
const Course = require('../models/course.models');
const NotFoundException = require('../exceptions/NotFoundException');

const getAllTeachers = async (req, res) => {
    const teachers = await Teacher.find().exec();
    res.json(teachers);
}

const getTeacherById = async (req, res) => {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).exec();
    if (!teacher) {
        throw new NotFoundException('Teacher not found')
    }
    res.json(teacher);
}

const addTeachers = async (req, res) => {
    const { firstname, lastname, email } = req.body;
    //data validation
    const teacher = new Teacher({
        firstname, lastname, email
    });
    await teacher.save();
    res.json(teacher);
}

const updateTeacherById = async (req, res) => {
    console.log('updating teacher');
    const { id } = req.params;
    const { firstname, lastname, email } = req.body;
    //findByIdAndUpdate automatically check input data
    //if there is an undefined, this field won't be updated
    const teacher = await Teacher.findByIdAndUpdate(
        id,
        { firstname, lastname, email },
        {
            new: true,
            runValidators: true
        }
    ).exec();
    if (!teacher) {
        throw new NotFoundException('Teacher not found')
    }
    res.json(teacher);
}

const deleteTeacherById = async (req, res) => {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).exec();
    if (!teacher) {
        throw new NotFoundException('Teacher not found')
    }
    teacher.courses.forEach(async (course) => {
        const courseId = course.code;
        await Course.findByIdAndUpdate(courseId,
            { $pull: { teachers: id } }
        ).exec();
    })
    await Teacher.findByIdAndDelete(id).exec();
    res.sendStatus(204);
}


// /v1/teachers/:teacherId/courses/:courseId
const addTeacherToCourse = async (req, res) => {
    const { teacherId, courseId } = req.params;
    const teacher = await Teacher.findById(teacherId).exec();
    const course = await Course.findById(courseId).exec();
    if (!teacher || !course) {
        throw new NotFoundException('Teacher or course not found')
    }

    teacher.courses.addToSet(courseId);
    course.teachers.addToSet(teacherId);

    await teacher.save();
    await course.save();

    res.json(teacher);
}

// /v1/teachers/:teacherId/courses/:courseId
const removeTeacherFromCourse = async (req, res) => {
    const { teacherId, courseId } = req.params;
    const teacher = await Teacher.findById(teacherId).exec();
    const course = await Course.findById(courseId).exec();
    if (!teacher || !course) {
        throw new NotFoundException('Teacher or course not found')
    }

    await Teacher.findByIdAndUpdate(teacherId,
        { $pull: { courses: courseId } }
    ).exec();
    await Course.findByIdAndUpdate(courseId,
        { $pull: { teachers: teacherId } }
    ).exec();

    res.sendStatus(204);
}

module.exports = {
    getAllTeachers,
    getTeacherById,
    addTeachers,
    updateTeacherById,
    deleteTeacherById,
    addTeacherToCourse,
    removeTeacherFromCourse
}
