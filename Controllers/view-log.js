const ItemLog = require('../Models/item-log');
const UserLog = require('../Models/user-log');
const User = require('../Models/users');
const Item = require('../Models/inventory');
const {validateAdminPrevileges} = require('./validate-privileges');

const viewUserLogs = async (req, res) => {
    Object.keys(req.body).forEach((key) => {
        if(req.body[key] === ''){
            delete req.body[key];
        }
    });
    
    const{
        query: {adminUID, userID, modification},
        user: {privilege: prev, state}
    } = req;

    validateAdminPrevileges(prev, state);
    const queryObject = {};

    if(adminUID){
        queryObject.originedBy = adminUID;
    }

    if(userID){
        queryObject.changesTo = userID;
    }

    if(modification){
        queryObject.modification = {$regex: modification, $options: 'i'};
    }

    const logs = await UserLog.find(queryObject);

    res.status(200).json(
        {
            success: true,
            count: logs.length,
            logs
        }
    );
}

const viewItemLogs = async (req, res) => {
    Object.keys(req.body).forEach((key) => {
        if(req.body[key] === ''){
            delete req.body[key];
        }
    });

    const {userID, itemID, modification} = req.query;
    const queryObject = {};

    if(userID){
        queryObject.originedBy = userID;
    }

    if(itemID){
        queryObject.changesTo = itemID;
    }

    if(modification){
        queryObject.modification = {$regex: modification, $options: 'i'};
    }

    const logs = await ItemLog.find(queryObject);

    res.status(200).json(
        {
            success: true,
            count: logs.length,
            logs
        }
    );
}

const viewSingleUserLog = async (req, res) => {
    const{
        user: {privilege: prev, state},
        params: {id: logID}
    } = req;

    validateAdminPrevileges(prev, state);
    const logs = await UserLog.findOne({_id: logID});

    if(!logs){
        throw new Error404('Unable to find the log entry');
    }

    res.status(200).json(
        {
            success: true,
            logs
        }
    );
}

const viewSingleItemLog = async (req, res) => {
    
    const {params: {id: logID}} = req
    const logs = await ItemLog.findOne({_id: logID});

    if(!logs){
        throw new Error404('Unable to find the log entry');
    }

    res.status(200).json(
        {
            success: true,
            logs
        }
    );
}


module.exports = {
    viewUserLogs,
    viewItemLogs,
    viewSingleUserLog,
    viewSingleItemLog
};