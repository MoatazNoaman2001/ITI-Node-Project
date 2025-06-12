import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true,
        trim: true
    },
    "email": {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: 'Invalid email format'
        }
    },
    "password": {
        type: String,
        required: true,
        select: false,
        validate: {
            validator: (v) => v.length >= 8,
            message: 'Password must be at least 8 characters'
        }
    },
    "phoneNumber": {
        type: String,
        required: true
    },
    "address": {
        type: String,
        required: true
    },
    "role": {
        type: String,
        enum: ['seller', 'user'],
        default: 'user'
    },
    "resetPasswordToken": String,
    "resetPasswordExpires": Date,
    "createdAt": {
        type: Date,
        default: Date.now
    },
    "updatedAt": {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    this.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000;
    
    return resetToken;
};

userSchema.methods.clearResetToken = function() {
    this.resetPasswordToken = undefined;
    this.resetPasswordExpires = undefined;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;