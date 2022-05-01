const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    alias: {
        type: String,
        required: [true, 'Please provide a user name or alias'],
        minlength: 3,
        maxlength: 25
    },
    userID: {
        type: String,
        required: [true, 'Please provide user ID'],
        unique: true,
        maxlength: 100
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6
    },
    privileges: {
        type: String,
        enum: {
            values: ['Admin', 'Edit only', 'View only'],
            message: '{VALUE} is not supported'
        },
        default: 'View only'
    },
    activeUser: {
        type: Boolean,
        default: false
    }
},
{timestamps: true}
);

userSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(15);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function() {
    return jwt.sign(
        {
            recordID: this._id,
            name: this.alias,
            userId: this.userID,
            privilege: this.privileges,
            state: this.activeUser
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_LIFETIME
        }
    );
}

userSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};


module.exports = mongoose.model('User', userSchema);