const Items = require('../Models/inventory');
const {Error404} = require('../Errors');

const viewAll = async (req, res) => {
    const {itemID, name, mainCategory, subCategory1, subCategory2, subCategory3, activeStatus, amountFilters} = req.query;
    const queryObject = {};

    if(itemID){
        queryObject.itemID = {$regex: itemID, $options: 'i'};
    }

    if(name){
        queryObject.itemName = {$regex: name, $options: 'i'};
    }

    if(mainCategory){
        queryObject.mainGroup = {$regex: mainCategory, $options: 'i'};
    }

    if(subCategory1){
        queryObject.subGroup1 = {$regex: subCategory1, $options: 'i'};
    }

    if(subCategory2){
        queryObject.subGroup2 = {$regex: subCategory2, $options: 'i'};
    }

    if(subCategory3){
        queryObject.subGroup3 = {$regex: subCategory3, $options: 'i'};
    }

    if(activeStatus){
        queryObject.activeStatus = activeStatus === 'false'? false : true;
    }

    const items = await Items.find(queryObject);

    res.status(200).json(
        {
            success: true,
            count: items.length,
            items
        }
    );
}

const viewSingleItem = async (req, res) => {
    const {params: {id: itemID}} = req;

    const singleItemByID = await Items.findOne({itemID: itemID.toUpperCase()});
    
    if(!singleItemByID){
        throw new Error404('Unable to find the item');
    }

    res.status(200).json(
        {
            success: true,
            singleItemByID 
        }
    );
}


module.exports = {
    viewAll,
    viewSingleItem
};