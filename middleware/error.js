const ErrorResponse = require('../utils/errorResponse');


const errorHandler = (err, req, res, next) => {

    let error = { ...err }
    error.message = err.message;


    console.log(err.stack.red);
    //console.log(err);
    //console.log(err.name,err.code)

    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`
        error = new ErrorResponse(message, 404);
    }
    else if (err.name === 'MongoError' && err.code === 11000) {
        const message = `Duplicate value entered,${err.keyValue.name} already exists`
        error = new ErrorResponse(message, 400);
    }
    else if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);

    }
    res.status(error.statusCode).json({
        success: false,
        error:error.message,
    });
}

module.exports = errorHandler;