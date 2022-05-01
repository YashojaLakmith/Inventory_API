const APIError = require('./custom-error');

class BadRequestError extends APIError{
    constructor(message){
        super(message);
        this.statusCode = 400;
    }
}


module.exports = BadRequestError;