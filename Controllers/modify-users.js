const User = require('../Models/users');
const UserLog = require('../Models/user-log');
const {validateAdminPrevileges} = require('./validate-privileges');
const {userEventLogging} = require('./event-logging');
const {Error400, Error401, Error403, Error404} = require('../Errors');
const bcrypt = require('bcryptjs');


const modifyUsers = async (req, res) => {
    Object.keys(req.body).forEach((key) => {
        if(req.body[key] === ''){
            delete (req.body[key]);
        }
    });

    const{
        user: {userId, privilege: prev, state},
        params: {id: userID},
        body: {password}
    } = req;

    validateAdminPrevileges(prev, state);

    const userPriorChanges = await User.findOne({userID: userID}).lean();

    if(!userPriorChanges){
        throw new Error404('Unable to find the user');
    }

    if(userPriorChanges.privileges === 'Admin'){
        if(!password){
            throw new Error401('User password is required to modify a user with Admin privileges');
        }
        
        const isPasswordCorrect = bcrypt.compare(password, userPriorChanges.password);
        if(!isPasswordCorrect){
            throw new Error400('Password is incorrect');
        }
    }

    delete req.body.userID && delete req.body.password;

    const userAfterChanges = await User.findOneAndUpdate(
        {userID: userID},
        req.body,
        {new: true, runValidators: true}
    );

    const userObj = userAfterChanges.toObject();

    delete userObj.password;
    delete userPriorChanges.password;

    userEventLogging(
        userId,
        userID,
        'Modified user information',
        userPriorChanges,
        userObj
    );

    res.status(200).json(
        {
            success: true,
            task: 'Modified user information',
            userObj
        }
    );
}

const changePassword = async (req, res) => {
    Object.keys(req.body).forEach((key) => {
        if(req.body[key] === ''){
            delete req.body[key];
        }
    });
    
    const {
        user: {userId, privilege: prev, state},
        params: {id: userID},
        body: {password, newPassword, confirmPassword}
    } = req;
    
    validateAdminPrevileges(prev, state);

    if(!newPassword || !confirmPassword){
        throw new Error400('Please provide new password and confirmation');
    }

    if(newPassword !== confirmPassword){
        throw new Error400('New password and confirmation do not match');
    }

    const user = await User.findOne({userID: userID});
    if(!user){
        throw new Error404('Unable to find the user');
    }

    if(user.privileges === 'Admin'){
        if(!password){
            throw new Error400('Please provide current password for change credentials of an Admin account');
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            throw new Error401('Password is incorrect');
        }
    
        await User.findOneAndUpdate(
            {userID: userID},
            {password: newPassword},
            {new: true, runValidators: true}
        );
    
        userEventLogging(
            userId,
            userID,
            'Changed user password',
            null,
            null
        );
    
        return res.json(200).json(
            {
                success: true,
                user: userID,
                task: 'Changed user password'
            }
        );
    }

    await User.findOneAndUpdate(
        {userID: userID},
        {password: newPassword},
        {new: true, runValidators: true}
    );

    userEventLogging(
        userId,
        userID,
        'Changed user password',
        null,
        null
    );

    res.json(200).json(
        {
            success: true,
            user: userID,
            task: 'Changed user password'
        }
    );
}

const deleteUser = async (req, res) => {
    const {
        body: {password},
        user: {userId, privilege: prev, state},
        params: {id: userID}
    } = req;

    validateAdminPrevileges(prev, state);
    
    const user = await User.findOne({userID: userID}).lean();

    if(!user){
        throw new Error404('Unable to find the user');
    }

    if(user.privileges === 'Admin'){
        if(!password){
            throw new Error400('Account password is required to delete an admin account');
        }

        const numberofAdminAccounts = await User.find({privileges: 'Admin'});
        if(numberofAdminAccounts.length === 1){
            throw new Error400('System must have at least one account with Admin privileges');
        }

        const isPasswordCorrect = bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            throw new Error401('Password in incorrect');
        }

        delete user.password;
        await User.findOneAndDelete({userID: userID});
        await userEventLogging(
            userId,
            userID,
            'Deleted user',
            user,
            null
        );

        return res.status(200).json(
            {
                success: true,
                user: userID,
                task: 'Deleted user'
            }
        );
    }

    delete user.password;
    await User.findByIdAndDelete({_id: userID});
    await userEventLogging(
        recordID,
        userID,
        'Deleted user',
        user,
        null
    );

    res.status(200).json(
        {
            success: true,
            user: userID,
            task: `Deleted user ${userID}`
        }
    );
}


module.exports = {
    modifyUsers,
    changePassword,
    deleteUser
};