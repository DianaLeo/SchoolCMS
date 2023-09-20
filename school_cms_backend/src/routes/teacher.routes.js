const {
    getAllTeachers,
    getTeacherById,
    addTeachers,
    updateTeacherById,
    deleteTeacherById,
    addTeacherToCourse,
    removeTeacherFromCourse
} = require('../controllers/teacher.controllers');
const {Router} = require('express');

const teacherRouter = Router();

teacherRouter.get('/',getAllTeachers);
teacherRouter.get('/:id',getTeacherById);
teacherRouter.post('/',addTeachers);
teacherRouter.put('/:id',updateTeacherById);
teacherRouter.delete('/:id',deleteTeacherById);
teacherRouter.put('/:teacherId/courses/:courseId', addTeacherToCourse);
teacherRouter.delete('/:teacherId/courses/:courseId', removeTeacherFromCourse);

module.exports = teacherRouter;