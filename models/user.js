const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "email": {
        type: String,
        required: true,
        unique: true,
        validate: {
            isEmail: true,
            message: 'Invalid email format'
        }
    },
    "password": {
        type: String,
        required: true,
        validate: {
            len: [8, 255],
            message: 'Password must be between 8 and 255 characters'
        }
    },
    "phoneNumebr": {
        type: String,
        required: true,
    },
    "address": {
        type: String,
        required: true,
    },
    "role" : {
        type: String,
        enum: ['seller', 'user'],
        default: 'user'
    },
    "resetPasswordToken": {
        type: String,
        default: null
    },
    "resetPasswordExpires": {
        type: Date,
        default: null
    },
    "createdAt": {
        type: Date,
        default: Date.now
    },
    "updatedAt": {
        type: Date,
        default: Date.now
    }

});

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        const saltRounds = 10;
        bcrypt.hash(this.password, saltRounds, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
            next();
        });
    } else {
        next();
    }
});

export default mongoose.model.User || mongoose.model('User', userSchema);