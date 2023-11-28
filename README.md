# School_CMS

## Backend Error Handling

### 1. Handle errors -> handle async errors
1. async await -> try catch
```javascript
try {
    xxxxx
} catch(e) {
    next(e);
    // or handle it directly
}
```

2. promise -> .catch
```javascript
Student.find().exec().then().catch(e => next(e));
```

3. callback
```javascript
Student.find().exec((err, students)=>{
    if (err) {
       // or handle error
       next(err);
       return
    }
})
```

### 2. Instead of writing 'try&catch' in every controller, we can hand-write a middleware wrapper, which returns a middleware
```javascript
const catchAllErrors = (routeHandler) => {
  return async (req, res,next) => {
    try {
      await routeHandler(req, res, next);
    } catch(e) {
      next(e);
    }
  }
}

// and call it before every handler
courseRouter.get('/', catchAllErrors(getAllCourses));
courseRouter.get('/:id', catchAllErrors(getCourseById));
courseRouter.post('/', catchAllErrors(addCourse));
courseRouter.put('/:id', catchAllErrors(updateCourseById));
courseRouter.delete('/:id', catchAllErrors(deleteCourseById));
```

#### express-async-errors
express-async-errors is an npm package，whose purpose is to call try&catch for us，and also call next（e）
This package doesn't do any error handling.

without this package, when it goes to `catch(e){}`, the server is down
with this package, *express calls its built-in error middleware*，return 500 with error messages, but wont't shut the server down


### 3. Customize error handling middlewares
Instead of using middleware wrappers and the package calling try&catch, we can customize error handling middlewares and use them in index.js.
There are two middleware chains in express, one is normal middleware chain, the other one is **error middleware chain**.
If any error occurs, it jumps to the error middleware chain **automatically**.
Thus we don't need try-catch if we use error middlewares.

combine with morgan to locate the error

**src/middlewares/error/validationError.js**
```javascript
module.exports = (error, req, res, next) => {
    if (error.name === 'ValidationError') {
        const errors = {};
        for (const field in error.errors) {
            console.log(error.message);
            errors[field] = error.errors[field].message;
        }
        return res.status(400).json({ errors });
    }
    next(error); // next to unknown error
}
```
The reason we can write this way `if (error.name === 'ValidationError')` is that Mongoose error type is:

```javascript
{
    errors
    _message
    prototype:{
        name
        ...
    }
}
```

**src/middlewares/error/unknownError.js**
```javascript
module.exports = (error, req, res, next) => {
    console.error("Unexpected error occurred", error);
    res
        .status(500)
        .json({ error: "Unexpected error occurred, please try again later" });
}
```

**index.js**
```javascript
app.use(validationError);
app.use(unknownError);
```


### 4. Customize error types
Define a new error class
**src/exceptions/NotFoundException.js**
```javascript
class NotFoundException extends Error {}
module.exports = NotFoundException
```

My code changes from this
```javascript
if (!code || !name){
    res.status(400).json({error:'Bad request'});
    return;
}
```

to this (however status from 404 to 500)
```javascript
if (!code || !name){
    throw new NotFoundException('Course not found');
}
```

I can add a error handling middleware for this specific type
**src/middlewares/error/notFoundError.js**
```javascript
const NotFoundException = require("../../exceptions/NotFoundException")
module.exports = (error, req, res, next) =>{
    if (error instanceof NotFoundException) {
        res.status(404).json({error:error.message});
        return;
    }
    next(error);
}
```
Then the status code changes back from 500 to 404

The advantage of this method is that, if I want to modify the error return type from an object to a string, I only modify one place, which is the class definition.



### 5. Three methods to deal with errors in controller

```javascript
if (!student) {
    // method 1 goes to error middleware chain
    throw new NotFoundException('Student not found')
    // method 2 goes to error middleware chain
    next(new NotFoundException('Student not found'))
    // method 3 not going to error middleware chain, return directly
    res.status(404).json({error:'Student not found'})
}
```



## Backend Schema Validation

### 1. Validation inside Schema
Validation inside Schema makes the Schema file verbose.
**/src/models/*.model.js**
```javascript
const Joi = require('joi');

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const studentSchema = new Schema({
    //omit other fields
    email: {
        type: String,
        //method 1:
        validate: [validateEmail, 'Please fill a valid email address'],
        //method 2:
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        //method 3:
        validate:[
            {
                validator:email=>{
                    return Joi.string().email().validate(email).error === undefined;
                },
                msg:'Invalid email format',
            }
        ]
    },
});
```
And in controllers, have to explicitly turn on the `runValidators`, because only `save()` will run validators automatically
**/src/controllers/*.controller.js**
```javascript
try{
    const student = await Student.findByIdAndUpdate(
            id,
            { firstname, lastname, email },
            {
                new: true,
                runValidators: true
            }
        ).exec();
}
```

### 2. Validation outside Schema
Use Joi to define specific schemas for controllers
To reuse the fields and allowUnknown option, can put them in another validation folder.

**/src/controllers/*.controller.js**
```javascript
const Joi = require('joi');

const addCourse = async (req, res) => {
    const schema = Joi.object({
        code: Joi.string()
            .uppercase()
            .regex(/^[a-zA-Z][a-zA-Z]-[a-zA-Z][a-zA-Z]-\d\d$/)
            .message('Invalid code format, expecting "xx-xx-00", x for a letter, 0 for a number')
            .required(),
        name: Joi.string().required(),
        description: Joi.string().optional(),
    })
    const validBody = await schema.validateAsync(req.body, {
        allowUnknown: true, // allow fields that are not defined in the Schema, won't throw errors
        stripUnknown: true, // don't process those unknown fields and delete them 
    });
    const course = new Course(validBody);
    await course.save();
    res.json(course);
}
```

But the error type has changed to:
```
validation error [Error [ValidationError]: "description" is not allowed to be empty] {
  _original: {
    code: 'XX-XA-10',
    name: 'test',
    description: '',
    students: '',
    teachers: ''
  },
  details: [
    {
      message: '"description" is not allowed to be empty',
      path: [Array],
      type: 'string.empty',
      context: [Object]
    }
  ]
}
```
Although `error.name` is still `validationError`, the validationError middleware is not reuseable because of the structure change.

So I prefer doing validation inside Schema


## Backend User Login
### Password-related Concept
##### encrypt - decrypt
x -> y
y -> x

##### hash
x -> y
y !-> x
Although `y` cannot be decrypted back to `x`, the hash algorithm is the same.
When a user registers an account for the first time, `y` is stored in DB.
Next time when the user logins, `x` will redo hash algorithm to `y`, and compared with the `y` in DB.

##### add salt (random string)
register
x + salt1 -> hash -> y (salt1) store y and salt1 in DB

login
x' + salt1 -> hash -> y' (salt1)
x === x' -> y === y'

### 'bcrypt' hash package

#### 1. Customize a generate hashPassword function for register
Different ways to use bcrypt. This repo used method 1
##### method 1
Define a hashPassword method in model
**src/models/user.model.js**
```javascript
schema.methods.hashPassword = async function () {
    this.password = await bcrypt.hash(this.password, 12); // hash returns a promise
}
```
And call it with any user document
**src/controllers/auth.controller.js**
```javascript
const register = async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.hashPassword();
    await user.save();
    res.status(201).json({ _id: user._id, username });
}
```

##### method 2 avoid using 'this'
Extract the function into a file
**src/utils/password.js**
```javascript
const bcrypt = require('bcrypt');
const hashPassword = async (rawPassword) => {
    return bcrypt.hash(rawPassword, 12); // hash returns a promise
}
module.exports = {hashPassword};
```
And call it. It is not bound with user model.
**src/controllers/auth.controller.js**
```javascript
const register = async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    user.password = await hashPassword(password);
    await user.save();
    res.status(201).json({ _id: user._id, username });
}
```

##### method 3 directly use bcrypt inside controllers
**src/controllers/auth.controller.js**
```javascript
const register = async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    user.password = bcrypt.hash(password,12);
    await user.save();
    res.status(201).json({ _id: user._id, username });
}
```


#### 2. Customize a validatePassword function for login
in model
```javascript
schema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};
```
in controller
```javascript
const login = async (req, res) => {
    //...
    const validatePassword = await user.validatePassword(password);
    if (!validatePassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    //...
};
```


### Access token JWT
On login success, backend returns a token to frontend.
From then on, every time the user login, or send any request, the token will be appended
![Access token](/assets/images/access%20token.jpg)
![invalid signature](/assets/images/invalid%20signature.png)
![signature verified](/assets/images/signature%20varified.jpg)

#### Generate token
```javascript
const generateToken = (payload) => {
    return jwt.sign(payload, secret, { expiresIn: '1d' });
}
const validateToken = (token) => {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        return null;
    }
}
```
payload can include email, username, role, avatar,...

generateToken can happen in different stage: 
1. when user register successfully
2. generateToken when user register successfully, but cannot use until user validate by email
3. generateToken until user validate by email 
4. when user login successfully

```javascript
const register = async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body,'req.body');
    const user = new User({ username, password });
    await user.hashPassword();
    await user.save();

    const token = generateToken({_id: user._id, username, role:'admin'});
    res.status(201).json({token});
}
```

#### AuthGuard middleware
Now since we already got a token, how do we make sure that the user has taken take this token with him when he send a request

```javascript
module.exports = (req,res,next)=>{
    const authorization = req.header('Authorization');
    if (!authorization) {
        res.status(401).json({error:'Missing authorization header'});
        return;
    }
    // Bearer xxxxx
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer' || !token) {
        res.status(401).json({error:'Invalid token'});
        return;
    }
    const payload = validateToken(token);
    if (!payload) {
        res.status(401).json({error:'Invalid token'});
        return;
    }
    // req.user = payload;
    next();
}
```
```javascript
v1Router.use('/courses', authGuard, courseRouter);
```


#### jwt
cross-domain
third-party login

private ley public key
Single Sign On

#### cookie-session
session id -> user -> cookie (same domain)
SSR server side rendering


### Role control
RBAC role based access control
ABAC attribute based access control

admin - when generateToken(payload), give a field: role:'admin'

 /roleGuard.js
```javascript
//high order function
module.exports = (role)=>(req,res,next)=>{
    //same as authGuard
    if (payload.role!==role) {
        res.status(403).json({error:'Invalid permission'});
        return;
    }
}
```
```javascript
v1Router.use('/courses', roleGuard('admin'), courseRouter);
```