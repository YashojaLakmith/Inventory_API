const Items = require('../Models/inventory');
const {itemEventLogging} = require('./event-logging');
const {validateEditOnlyPrevileges} = require('./validate-privileges');
const {Error400, Error403, Error404} = require('../Errors');

const getFromInventory = async (req, res) => {
    Object.keys(req.body).forEach((key) => {
        if(req.body[key] === ''){
            delete req.body[key];
        }
    });

    const {
        body: {amountOfItems, remarks},
        user: {userId, privilege: prev, state},
        params: {id: itemID}
    } = req;

    validateEditOnlyPrevileges(prev,state);

    if(!amountOfItems){
        throw new Error400('Amount must be specified');
    }

    const amount = Number(amountOfItems);
    if(!amount || amount <= 0 || amount === null){
        throw new Error400('The amount must be a numerical value and must not be less than or equal to 0');
    }

    const getItem = await Items.findOne({itemID: itemID.toUpperCase()}).lean();
    if(!getItem){
        throw new Error404('Unableto find the item');
    }

    if(getItem.activeStatus !== true){
        throw new Error403('Item is currently inactive');
    }

    if(getItem.itemAmount < amount){
        return res.status(400).json(
            {
                success: false,
                description: 'Not sufficient items available in the inventory'
            }
        );
    }
    const balanceItems = getItem.itemAmount - amount;
    const item = await Items.findOneAndUpdate(
        {itemID: itemID.toUpperCase()},
        {itemAmount: balanceItems},
        {new: true, runValidators: true}
    );

    const itemObj = item.toObject();

    if(!remarks){
        req.body.remarks = '';
    }

    itemEventLogging(
        userId,
        item.itemID,
        `Got ${amount} units from the item ${itemID}`,
        getItem,
        itemObj,
        remarks
    );

    res.status(200).json(
        {
            success: true,
            task: `Got ${amount} units from the item ${itemID}`,
            item
        }
    );
}

const addToInventory = async (req, res) => {
    Object.keys(req.body).forEach((key) => {
        if(req.body[key] === ''){
            delete req.body[key];
        }
    });

    const {
        body: {amountOfItems, remarks},
        user: {userId, privilege: prev, state},
        params: {id: itemID}
    } = req;

    validateEditOnlyPrevileges(prev,state);

    if(!amountOfItems){
        throw new Error400('Amount must be specified');
    }

    const amount = Number(amountOfItems);
    if(!amount || amount <= 0 || amount === null){
        throw new Error400('The amount must be a numerical value and must not be less than or equal to 0');
    }

    const getItem = await Items.findOne({itemID: itemID.toUpperCase()}).lean();

    if(!getItem){
        throw new Error404('Unableto find the item');
    }

    if(getItem.activeStatus !== true){
        throw new Error403('Item ins currently inactive');
    }

    const balanceItems = getItem.itemAmount + amount;

    if((balanceItems) >= Number.MAX_SAFE_INTEGER){
        return res.status(400).json(
            {
                success: false,
                description: 'Inventry amount went out of limits'
            }
        );
    }
    
    const item = await Items.findOneAndUpdate(
        {itemID: itemID.toUpperCase()},
        {itemAmount: balanceItems},
        {new: true, runValidators: true}
    );

    const itemObj = item.toObject();

    itemEventLogging(
        userId,
        item.itemID,
        `Added ${amount} units of the item ${itemID}`,
        getItem,
        itemObj,
        remarks
    );

    res.status(200).json(
        {
            success: true,
            task: `Added ${amount} units of the item ${itemID}`,
            item
        }
    );
}

const removeItem = async (req, res) => {
    const {
        user: {userId, privilege: prev, state},
        body: {remarks},
        params: {id: itemID}
    } = req;

    validateEditOnlyPrevileges(prev, state);

    const amount = await Items.findOne({itemID: itemID.toUpperCase()}).lean();
    
    if(!amount){
        throw new Error404('Unable to find the item');
    }
    
    await Items.findOneAndDelete(
        {itemID: itemID.toUpperCase()}
    );

    itemEventLogging(
        userId,
        amount.itemID,
        `Removed the item ${itemID} from the inventory with its ${amount.itemAmount} units`,
        amount,
        null,
        remarks
    );

    res.status(200).json(
        {
            success: true,
            task: `Removed the item ${itemID} from the inventory with its ${amount.itemAmount} units`
        }
    );
}


module.exports = {
    getFromInventory,
    addToInventory,
    removeItem
};