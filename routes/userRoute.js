const router = require('express').Router();
const {        forgotPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail} = require('../controllers/userControllers');



router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/send-verification-email', sendVerificationEmail);
router.get('/verify-email/:token', verifyEmail);

module.exports = router;
