const mongoose = require('mongoose');

const itemLogSchema = new mongoose.Schema({
    originedBy: {
        type: String,
        required: [true, 'Please provide user']
    },
    originedAt: {
        type: Date,
        default: Date.now()
    },
    changesTo: {
        type: String,
        required: [true, 'Please provide item']
    },
    modification: {
        type: String,
        require: [true, 'Modification must be specified']
    },
    remarks: {
        type: String,
        maxlength: 200,
        default: ''
    },
    beforeChanges: {
        type: Object,
        default: {value: null}
    },
    afterChanges: {
        type: Object,
        default: {value: null}
    }
});


module.exports = mongoose.model('ItemLog', itemLogSchema);