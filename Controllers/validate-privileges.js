const {Error401} = require('../Errors');

const validateAdminPrevileges = (prev, state) => {
    if(prev !== 'Admin' || state == false){
        throw new Error401('You do not have permission to perform this task');
    }
}

const validateEditOnlyPrevileges = (prev, state) => {
    if((prev !== 'Admin' && prev !== 'Edit only') || state == false){
        throw new Error401('You do not have permission to perform this task');
    }
}

module.exports = {
    validateAdminPrevileges,
    validateEditOnlyPrevileges
};