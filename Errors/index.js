const APIError = require('./custom-error');
const Error400 = require('./bad-request-400');
const Error401 = require('./unauthorized-401');
const Error403 = require('./forbidden-403');
const Error404 = require('./not-found-404');


module.exports = {
    APIError,
    Error400,
    Error401,
    Error403,
    Error404
};