var express = require('express');
var router = express.Router();

const {getLoginPage, getRegisterPage, registerUser, verifyEmail, getForgotPassword, getForgotUser, getResetPasswordPage,
    resetPassword
} = require("../controllers/auth/authController");
const {passportAuthenticate} = require("../auth/passportAuth");
const {validateVerification} = require("../middlewares/auth");

router.get('/login', getLoginPage)
router.get('/verify',  verifyEmail)
router.post('/login', validateVerification, passportAuthenticate)

router.get('/register', getRegisterPage)
router.post('/register', registerUser)

router.get('/forgot-password', getForgotPassword);
router.post('/forgot-password', getForgotUser);

router.get('/reset-password', getResetPasswordPage);
router.post('/reset-password', resetPassword);

module.exports = router;