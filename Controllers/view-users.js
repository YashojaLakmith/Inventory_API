const User = require('../Models/users');
const {validateAdminPrevileges} = require('./validate-privileges');
const {Error404} = require('../Errors');


const viewAllUsers = async (req, res) => {
    const {
        user: {privilege: prev, state},
        query: {alias, userID, privilege, activeUser}
    } = req;
    const queryObject = {};
    
    validateAdminPrevileges(prev, state);

    if(alias){
        queryObject.alias = alias;
    }

    if(userID){
        queryObject.userID = userID;
    }

    if(privilege && (privilege === 'Admin' || privilege === 'Edit only' || privilege === 'View only')){
        queryObject.privileges = privilege;
    }

    if(activeUser){
        queryObject.activeUser = activeUser === 'true'? true : false;
    }

    const users = await User.find(queryObject).lean().sort('alias');

    for(let i = 0, len = users.length; i < len; i++){
        delete users[i].password;
    }
    
    res.status(200).json(
        {
            success: true,
            count: users.length,
            users
        }
    );
}

const viewSingleUser = async (req, res) => {
    const
    {
        user: {privilege: prev, state},
        params: {id: userID}
    } = req;

    validateAdminPrevileges(prev, state);
    const user = await User.findOne({userID: userID}).lean();

    if(!user){
        throw new Error404('Unable to find the user');
    }

    delete user.password;

    res.status(200).json(
        {
            success: true,
            user
        }
    );
}


module.exports = {
    viewAllUsers,
    viewSingleUser
};