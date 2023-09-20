const Course = require('../models/course.models');
const Student = require('../models/student.models');
const Teacher = require('../models/teacher.models');


const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().exec();
        res.json(courses);
    } catch (error) {
        res.status(500).json('Server error');
    }
};

const getCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id).populate('students', 'firstname lastname email').exec();
        if (!course) {
            res.status(404).json({ error: 'Course not found' });
            return
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            msg: error.message
        })
    }
};

const addCourse = async (req, res) => {
    const { _id, name, description } = req.body;
    const course = new Course({ _id, name, description });
    if (!_id || !name) {
        res.status(400).json({ error: 'Bad request' });
        return;
    }
    try {
        await course.save();
        res.json(course);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = {};
            for (const field in error.errors) {
                console.log(error.errors);
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ errors });
        }
        res.status(500).json({ msg: error.message})
    }
};

const updateCourseById = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const course = await Course.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        ).exec();
        if (!course) {
            res.status(404).json({ error: 'Course not found' });
            return
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            msg: error.message
        })
    }
};

const deleteCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id).exec();
        if (!course) {
            res.status(404).json({ error: 'Course not found' });
            return
        }
        //remove course from students
        const students = course.students;
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
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            msg: error.message
        })
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    addCourse,
    updateCourseById,
    deleteCourseById
}