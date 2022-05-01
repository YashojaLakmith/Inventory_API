//  register new users
//  login
//  change privileges
//  change info
//  change password
//  view log

//  create inventory item
//  change item & info & type
//  view items
//  view all
//  get from store
//  put to store
//  remove completely
//  view log

const {
    registerUser,
    login
} = require('./authentication');

const {
    createItems,
    modifyItems
} = require('./create-modify-items');

const {
    getFromInventory,
    addToInventory,
    removeItem
} = require('./get-add-remove-items');

const {
    modifyUsers,
    changePassword,
    deleteUser
} = require('./modify-users');

const {
    viewAll,
    viewSingleItem
} = require('./view-items');

const {
    viewUserLogs,
    viewItemLogs,
    viewSingleItemLog,
    viewSingleUserLog
} = require('./view-log');

const {
    viewAllUsers,
    viewSingleUser
} = require('./view-users');

module.exports = {
    registerUser,
    login,
    createItems,
    modifyItems,
    getFromInventory,
    addToInventory,
    removeItem,
    modifyUsers,
    changePassword,
    deleteUser,
    viewAll,
    viewSingleItem,
    viewUserLogs,
    viewItemLogs,
    viewSingleItemLog,
    viewSingleUserLog,
    viewAllUsers,
    viewSingleUser
};

