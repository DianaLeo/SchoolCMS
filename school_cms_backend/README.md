# School_CMS

## backend

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
Instead of using middleware wrappers and the package calling try&catch, we can customize error handling middlewares and use them in index.js

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

The advantage of this method is that, if I want to modify the error return type from an object to a string, I only modify one place, which is the class definition