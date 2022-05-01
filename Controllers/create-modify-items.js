const Items = require('../Models/inventory');
const {itemEventLogging} = require('./event-logging');
const {validateEditOnlyPrevileges} = require('./validate-privileges');
const {Error400, Error404} = require('../Errors/index');

const createItems = async (req, res) => {
    Object.keys(req.body).forEach((key) => {
        if(req.body[key] === ''){
            delete req.body[key];
        }
    });

    const {
        user: {userId, privilege: prev, state},
        body: {itemID, itemName, itemAmount, remarks}
    } = req;

    validateEditOnlyPrevileges(prev, state);

    if(!itemID || !itemName){
        throw new Error400('Item ID and Item name must be specified');
    }

    const numericItemAmount = Number(itemAmount)
    if(itemAmount && (!numericItemAmount || 0 > numericItemAmount)){
            throw new Error400('Amount must be a numerical value and not be less than 0');
    }

    if(numericItemAmount > Number.MAX_SAFE_INTEGER){
        throw new Error400('Amount is greater than the upper limit')
    }

    if(!remarks){
        req.body.remarks = '';
    }

    const item = await Items.create(req.body);
    const itemObj = item.toObject();

    itemEventLogging(
        userId,
        item.itemID,
        'Created new inventory item',
        null,
        itemObj,
        req.body.remarks
    );

    res.status(201).json(
        {
            success: true,
            task: 'Created new item',
            newItem: item,
        }
    );
}

const modifyItems = async (req, res) => {
    Object.keys(req.body).forEach((key) => {
        if(!req.body[key] || req.body[key] === ''){
            delete req.body[key];
        }
    });

    const {
        user: {userId, privilege: prev, state},
        params: {id: itemID},
    } = req;

    validateEditOnlyPrevileges(prev, state);

    const itemBefore = await Items.findOne({itemID: itemID.toUpperCase()}).lean();

    const item = await Items.findOneAndUpdate(
        {itemID: itemID.toUpperCase()},
        req.body,
        {new: true, runValidators: true}
    );

    if(!item){
        throw new Error404('Unable to find the item');
    }

    if(!req.body.remarks){
        req.body.remarks = '';
    }

    const itemObj = item.toObject();


    itemEventLogging(
        userId,
        item.itemID,
        'Change the details of the item',
        itemBefore,
        itemObj,
        req.body.remarks
    );

    res.status(200).json(
        {
            success: true,
            task: `Change the details of the item ${item._id}`,
            item
        }
    );
}


module.exports = {
    createItems,
    modifyItems
};