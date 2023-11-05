const { Router } = require('express');
const { getAllCourses, getCourseById, addCourse, updateCourseById, deleteCourseById } = require('../controllers/course.controllers');

const courseRouter = Router();

courseRouter.get('/', getAllCourses);
courseRouter.get('/:id', getCourseById);
courseRouter.post('/', addCourse);
courseRouter.put('/:id', updateCourseById);
courseRouter.delete('/:id', deleteCourseById);

module.exports = courseRouter;