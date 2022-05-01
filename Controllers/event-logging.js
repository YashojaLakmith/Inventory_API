const UserLog = require('../Models/user-log');
const ItemLog = require('../Models/item-log');

const duplicateRemoval = (pre, after) => {
  Object.keys(pre).map((key1) => {
    Object.keys(after).map((key2) => {
      if(pre[key1] === after[key2]){
        delete pre[key1] && delete after[key2];
      }
    })
  })
}

const userEventLogging = async (AdminID, userID, description, userInfoPrior, userInfoAfter) => {
  if(userInfoAfter && userInfoPrior){
    duplicateRemoval(userInfoPrior, userInfoAfter);
  }
  if(userInfoPrior){
    delete userInfoPrior._id && delete userInfoPrior.createdAt;
  }
  if(userInfoAfter){
    delete userInfoAfter._id && delete userInfoAfter.createdAt;
  }

  await UserLog.create(
    {
      originedBy: AdminID,
      changesTo: userID,
      modification: description,
      beforeChanges: userInfoPrior,
      afterChanges: userInfoAfter
    }
    );
}

const itemEventLogging = async (userID, itemID, description, itemInfoPrior, itemInfoAfter, rem) => {
  
  if(itemInfoAfter && itemInfoPrior){
    duplicateRemoval(itemInfoPrior, itemInfoAfter);
  }
  if(itemInfoPrior){
    delete itemInfoPrior._id && delete itemInfoPrior.createdAt;
  }
  if(itemInfoAfter){
    delete itemInfoAfter._id && delete itemInfoAfter.createdAt;
  }

  await ItemLog.create(
    {
      originedBy: userID,
      changesTo: itemID,
      modification: description,
      remarks: rem,
      beforeChanges: itemInfoPrior,
      afterChanges: itemInfoAfter
    }
  );
}

module.exports = {
  userEventLogging,
  itemEventLogging
};