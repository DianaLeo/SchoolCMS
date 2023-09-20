const Teacher = require('../models/teacher.models');
const Course = require('../models/course.models');

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().exec();
        res.json(teachers);
    } catch (error) {
        res.status(500).json('Server error');
    }
}

const getTeacherById = async (req, res) => {
    const { id } = req.params;
    try {
        const teacher = await Teacher.findById(id).exec();
        if (!teacher) {
            res.status(404).json('Teacher not found');
            return;
        }
        res.json(teacher);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            msg: error.message
        });
    }
}

const addTeachers = async (req, res) => {
    const { firstname, lastname, email } = req.body;
    //data validation
    const teacher = new Teacher({
        firstname, lastname, email
    });
    try {
        await teacher.save();
        res.json(teacher);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            console.log(errors);
            return res.status(400).json({ errors });
        }
        res.status(500).json(error);
    }
}

const updateTeacherById = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email } = req.body;
    try {
        //findByIdAndUpdate automatically check input data
        //if there is an undefined, this field won't be updated
        const teacher = await Teacher.findByIdAndUpdate(
            id,
            { firstname, lastname, email },
            { new: true }
        ).exec();
        if (!teacher) {
            res.status(404).json('Teacher not found');
            return;
        }
        res.json(teacher);
    } catch (error) {
        res.status(500).json({
            error: 'Sever error',
            msg: error.message
        });
    }
}
const deleteTeacherById = async (req, res) => {
    const { id } = req.params;
    try {
        const teacher = await Teacher.findById(id).exec();
        if (!teacher) {
            res.status(404).json('Teacher not found');
            return;
        }
        teacher.courses.forEach(async (course) => {
            const courseId = course.code;
            await Course.findByIdAndUpdate(courseId,
                { $pull: { teachers: id } }
                ).exec();
        })
        await Teacher.findByIdAndDelete(id).exec();
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            msg: error.message
        });
    }
}


// /v1/teachers/:teacherId/courses/:courseId
const addTeacherToCourse = async (req, res) => {
    const { teacherId, courseId } = req.params;
    try {
        const teacher = await Teacher.findById(teacherId).exec();
        const course = await Course.findById(courseId).exec();
        if (!teacher || !course) {
            res.status(404).json({ error: 'Teacher or course not found' })
            return;
        }

        teacher.courses.addToSet(courseId);
        course.teachers.addToSet(teacherId);

        await teacher.save();
        await course.save();

        res.json(teacher);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            msg: error.message
        })
    }
}

// /v1/teachers/:teacherId/courses/:courseId
const removeTeacherFromCourse = async (req, res) => {
    const { teacherId, courseId } = req.params;
    try {
        const teacher = await Teacher.findById(teacherId).exec();
        const course = await Course.findById(courseId).exec();
        if (!teacher || !course) {
            res.status(404).json({ error: 'Student or course not found' })
            return;
        }

        await Teacher.findByIdAndUpdate(teacherId,
            { $pull: { courses: courseId } }
        ).exec();
        await Course.findByIdAndUpdate(courseId,
            { $pull: { teachers: teacherId } }
        ).exec();

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            msg: error.message
        })
    }
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
