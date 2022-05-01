const User = require('../Models/users');
const jwt = require('jsonwebtoken');
const {Error401} = require('../Errors');

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new Error401('Authentication invalid');
    }

    const token = authHeader.split(' ')[1];
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = {
            recordID: payload.recordID,
            name: payload.name,
            userId: payload.userId,
            privilege: payload.privilege,
            state: payload.state
        };
        next();
    }catch(error){
        throw new Error401('Authentication invalid');
    }
}


module.exports = auth;