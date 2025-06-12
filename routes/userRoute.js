import express from 'express';
const userRouter = express.Router();

import {createUser, forgotPassword,
    loginUser,
    resetPassword,
    sendVerificationEmail,
    verifyEmail} from  '../controllers/userControllers.js';


userRouter.post('/login', loginUser);
userRouter.post('/register', createUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/send-verification-email', sendVerificationEmail);
userRouter.get('/verify-email/:token', verifyEmail);

export default userRouter;
