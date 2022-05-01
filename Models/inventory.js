const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemID: {
        type: String,
        required: [true, 'Please provide item id'],
        unique: true,
        minlength: 3,
        maxlength: 50
    },
    itemName: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: 50,
        minlength: 3
    },
    mainGroup: {
        type: String,
        default: 'General',
        minlength: 1,
        maxlength: 25,
    },
    subGroup1: {
        type: String,
        default: 'General',
        minlength: 1,
        maxlength: 25,
    },
    subGroup2: {
        type: String,
        default: 'General',
        minlength: 1,
        maxlength: 25,
    },
    subGroup3: {
        type: String,
        default: 'General',
        minlength: 1,
        maxlength: 25,
    },
    activeStatus: {
        type: Boolean,
        default: false
    },
    itemAmount: {
        type: Number,
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
        default: 0
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: [true, 'Please provide user']
    }
},
{timestamps: true}
);

inventorySchema.pre('save', function(next){
    this.itemID = this.itemID.toUpperCase();
    next();
});


module.exports = mongoose.model('Items', inventorySchema);