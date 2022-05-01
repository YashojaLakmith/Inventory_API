const User = require('../Models/users');
const UserLog = require('../Models/user-log');
const {validateAdminPrevileges} = require('./validate-privileges');
const {Error400, Error401} = require('../Errors');
const {userEventLogging} = require('./event-logging');

const registerUser = async (req, res) => {

    const {
        user: {userId, privilege, state},
        body: {userID, alias, password, confirmPassword}
    } = req;

    validateAdminPrevileges(privilege, state);

    if(!userID || !alias || !password || !confirmPassword){
        throw new Error400('User ID, Alias, and Password fields must not be empty');
    }

    if(password !== confirmPassword){
        throw new Error400('Password and the confirmation do not match');
    }

    const user = await User.create({...req.body});
    const userObj = user.toObject();
    delete userObj.password;
    
    userEventLogging(
        userId,
        user.userID,
        'Created new user',
        null,
        userObj
    );

    res.status(201).json(
        {
            success: true,
            task: 'Created new user',
            userObj
        }
    );
}

const login = async (req, res) => {
    const {userID, password} = req.body;
    if(!userID || !password) {
        throw new Error400('Please provide credentials');
    }

    const user = await User.findOne({userID});
    if(!user){
        throw new Error401('Invalid credential');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new Error401('Invalid credential');
    }

    const token = user.createJWT();

    res.status(200).json(
        {
            success: true,
            user: {name: user.alias, ID: user.userID},
            token
        }
    );
}


module.exports = {
    registerUser,
    login
};