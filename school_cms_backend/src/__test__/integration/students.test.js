// Integration test - supertest (package)
const supertest = require('supertest');
const app = require('../../app');
const Student = require('../../models/student.models');
const mongoose = require('mongoose');
const request = supertest(app);

// lifecycle hook
// before running test cases, open test db
beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__);
});
// after running test cases, close test db
afterAll(async () => {
  await mongoose.connection.close();
});

describe('/v1/students', () => {
  //describe('GET /', () => { })

  describe('POST /', () => {
    it('should save the student to db if request is valid', async () => {
      // post to /v1/students + student payload (+token)
      // setup
      const payload = {
        firstname: 'diana',
        lastname: 'liu',
        email: 'email@gmail.com'
      };

      // execute
      const res = await request.post('/v1/students').send(payload);

      // compare
      expect(res.statusCode).toBe(201);
      const student = await Student.findOne(payload).exec();
      //student will be null if not found
      expect(student).not.toBeNull();
    });

    it.each`
        property | value
        ${'firstname'} | ${undefined}
        ${'lastname'} | ${undefined}
        ${'email'} | ${'a'}
        ${'email'} | ${'a.com'}
        ${'email'} | ${'a@@a.com'}
        `('should return 400 if $property is $value', async ({ property, value }) => {
      const invalidStudent = {
        firstname: 'diana',
        lastname: 'liu',
        email: 'email@gmail.com',
        [property]: value
      };
      // execute
      const res = await request.post('/v1/students').send(invalidStudent);
      // compare
      expect(res.statusCode).toBe(400);
      const student = await Student.findOne(invalidStudent).exec();
      expect(student).toBeNull();
    });
  });
});