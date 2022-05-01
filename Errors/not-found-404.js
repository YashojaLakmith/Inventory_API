const APIError = require('./custom-error');

class NotFoundError extends APIError{
    constructor(message){
        super(message);
        this.statusCode = 404;
    }
}


module.exports = NotFoundError;