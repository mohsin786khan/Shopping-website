const ErrorHandler = require('../utils/errorHandler');




module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
       

    if (process.env.Node_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

 
    if (process.env.Node_ENV === 'PRODUCTION') {
        let error = { ...err }

        error.message = err.message;

         // wrong mongoose object ID error
         if (err.name === 'CastError') {
            const message = ` Ressource not found INVALID: ${err.path} `;
            error = new ErrorHandler(message, 400);
        }

         // handling mongoose validation error
         if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400);

        }

        
        // Handling Mongoose duplicate key errors
        if (err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400)
        }

         // Handling wrong JWT error
         if (err.name === 'JsonWebTokenError') {
            const message = 'JSON Web Token is invalid. Try Again!!!'
            error = new ErrorHandler(message, 400)
        }

         // Handling Expired JWT error
         if (err.name === 'TokenExpiredError') {
            const message = 'JSON Web Token is expired. Try Again!!!'
            error = new ErrorHandler(message, 400)
        }

    
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'INTERNAL SERVER ERROR'
        })
    }



}