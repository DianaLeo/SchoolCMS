const {Router} = require('express');
const studentRouter = require('./student.routes.js');
const courseRouter = require('./course.routes.js');
const teacherRouter = require('./teacher.routes.js');
const authRouter = require('./auth.routes.js');
const authGuard = require('../middlewares/authGuard.js');
const adminGuard = require('../middlewares/adminGuard.js');
const roleGuard = require('../middlewares/roleGuard.js');

const v1Router = Router();

v1Router.use('/students', studentRouter);
// authGuard and adminGuard can be added to anywhere thru the route, depending on your logic
//v1Router.use('/courses', authGuard, courseRouter); // only logged in users can read courses data
//v1Router.use('/courses', adminGuard, courseRouter); // only admin users can read courses data
v1Router.use('/courses', courseRouter); //roleGuard('admin'), 
v1Router.use('/teachers', teacherRouter);
v1Router.use('/auth', authRouter);

module.exports = v1Router;