// Customized validation error handler
// If I want to get a more detailed message,
// I can use morgan to get which request user sent,
// I can use winston to get which step the error occurred.
// Mongoose error type:
// {
//     errors
//     _message
//     prototype:{
//         name
//         ...
//     }
// }
module.exports = (error, req, res, next) => {
    if (error.name === 'ValidationError') {
        const errors = {};
        for (const field in error.errors) {
            console.log(error.message);
            errors[field] = error.errors[field].message;
        }
        return res.status(400).json({ errors });
    }
    next(error); // next to notFound error
}