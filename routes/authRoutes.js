var express = require('express');
var router = express.Router();

const {getLoginPage, getRegisterPage, registerUser, verifyEmail, getForgotPassword, getForgotUser, getResetPasswordPage,
    resetPassword, logoutUser
} = require("../controllers/auth/authController");
const {passportAuthenticate} = require("../auth/passportAuth");
const {validateVerification, isAuthenticated} = require("../middlewares/auth");

router.get('/login', getLoginPage)
router.get('/verify',  verifyEmail)
router.post('/login', validateVerification, passportAuthenticate)
router.post('/logout', isAuthenticated, logoutUser);

router.get('/register', getRegisterPage)
router.post('/register', registerUser)

router.get('/forgot-password', getForgotPassword);
router.post('/forgot-password', getForgotUser);

router.get('/reset-password', getResetPasswordPage);
router.post('/reset-password', resetPassword);

module.exports = router;