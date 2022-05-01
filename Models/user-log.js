const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
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
        required: [true, 'Please provide user']
    },
    modification: {
        type: String,
        require: [true, 'Modification must be specified']
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


module.exports = mongoose.model('UserLog', userLogSchema);