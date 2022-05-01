const ErrorHandling = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || 500,
        msg: err.message || 'Something went wrong. Please try again...'
    };

    if(err.name === 'ValidationError'){
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(',');
        customError.statusCode = 400;
    }

    if(err.code && err.code === 11000){
        customError.msg = `Value you entered for ${Object.keys(err.keyValue)} already exists. Please select a different one.`;
        customError.statusCode = 400;
    }

    if(err.name === 'CastError'){
        customError.msg = `No items found with ID ${err.values}`;
        customError.statusCode = 404;
    }

    return res.status(customError.statusCode).json({success: false, message: customError.msg});
}


module.exports = ErrorHandling;

