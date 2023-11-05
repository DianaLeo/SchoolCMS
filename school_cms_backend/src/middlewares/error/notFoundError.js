const NotFoundException = require("../../exceptions/NotFoundException")

module.exports = (error, req, res, next) =>{
    if (error instanceof NotFoundException) {
        res.status(404).json({error:error.message});
        return;
        // return here because one error can only be of one type
        // we don't need to call next after we've done dealing with it
    }
    next(error);
}