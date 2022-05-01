const APIError = require('./custom-error');

class ForbiddenError extends APIError{
    constructor(message){
        super(message);
        this.statusCode = 403;
    }
}


module.exports = ForbiddenError;