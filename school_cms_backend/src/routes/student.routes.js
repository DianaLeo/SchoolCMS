const {
    getAllStudents,
    getStudentById,
    addStudents,
    updateStudentById,
    deleteStudentById,
    addStudentToCourse,
    removeStudentFromCourse
} = require('../controllers/student.controllers');
const {Router} = require('express');

const studentRouter = Router();

studentRouter.get('/',getAllStudents);
studentRouter.get('/:id',getStudentById);
studentRouter.post('/',addStudents);
studentRouter.put('/:id',updateStudentById);
studentRouter.delete('/:id',deleteStudentById);
studentRouter.put('/:studentId/courses/:courseId', addStudentToCourse);
studentRouter.delete('/:studentId/courses/:courseId', removeStudentFromCourse);

module.exports = studentRouter;