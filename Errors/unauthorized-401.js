const APIError = require('./custom-error');

class Unauthorized extends APIError{
    constructor(message){
        super(message);
        this.statusCode = 401;
    }
}


module.exports = Unauthorized;