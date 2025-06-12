import crypto from 'crypto';
import UserModel from '../models/user.js';
import jwt from "jsonwebtoken";
import { transporter, mailSchema } from '../utils/smtp.js';

export const createUser = async (req, res) => {
    try {
        console.log(`res.body: ${JSON.stringify(req.body)}`);
        
        const user = new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            role: req.body.role,
            createdAt: new Date(),
        });
        const savedUser = await user.save();
        console.log('saved');
        let token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.SECRET, { expiresIn: '30d' })
        console.log(`jwt: ${token}`);
        res.status(200).json({
            "status": "success",
            "token": token,
            "user": savedUser
        });
    } catch (err) {
        console.log(`error: ${err}`);
        
        res.status(500).json(err);
    }
}
export const loginUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            return res.status(500).json({
                "title": "failed",
                "message": "email and password are must"
            })
        }
        let user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: `email with ${email} is not exist`
            })
        }

        console.log(`password: ${password}, userPassword: ${user.password}`);
        
        let isValid = user.comparePassword(password)

        if (!isValid) {
            return res.status(401).json({
                status: "fail",
                message: "invalid email or password aaaa"
            })
        }


        let token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.SECRET, { expiresIn: '30d' })
        res.status(200).json({
            status: "success",
            token: token
        })
    } catch (err) {
        console.log(`error: ${err}`);
        
        res.status(500).json(err);
    }
}


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User with this email doesn't exist"
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await transporter.sendMail(mailSchema(
            user.email,
            'Password Reset Request',
            `
              <h1>You requested a password reset</h1>
              <p>Please click on the following link to reset your password:</p>
              <a href="${resetUrl}" target="_blank">Reset Password</a>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
            `
        ));

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(500).json({
            success: false,
            message: "An error occurred, please try again later"
        });
    }

}
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        console.log(`resetPassToken: ${resetPasswordToken}`);
        
        const user = await UserModel.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        await transporter.sendMail(mailSchema(
            user.email,
            'Password Reset Successful',
            `
              <h1>Password Reset Successful</h1>
              <p>Your password has been successfully reset.</p>
              <p>If you didn't reset your password, please contact support immediately.</p>
            `
        ));

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred, please try again later"
        });
    }
};
export const sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');

        user.verificationToken = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');
        user.verificationExpires = Date.now() + 24 * 3600000;

        await user.save();

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

        await transporter.sendMail(mailSchema(
            user.email,
            'Email Verification',
            `
              <h1>Email Verification</h1>
              <p>Please click on the following link to verify your email:</p>
              <a href="${verificationUrl}" target="_blank">Verify Email</a>
              <p>This link will expire in 24 hours.</p>
            `
        ));


        res.status(200).json({
            success: true,
            message: "Verification email sent"
        });

    } catch (error) {
        console.error('Send verification email error:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred, please try again later"
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const verificationToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await UserModel.findOne({
            verificationToken,
            verificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred, please try again later"
        });
    }
};