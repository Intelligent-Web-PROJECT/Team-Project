const {User} = require("../models/models");
const isAuthenticated = (req, res, next) => {
    req.isLoggedIn = false;
    if(req.isAuthenticated() && req.user){
        req.isLoggedIn = true;
        next();
    } else {
        res.redirect("/login")
    }
}

// This middleware should be used where the route is not restricted to logged-in users but authentication info is required.
const authInfo = (req, res, next) => {
    req.isLoggedIn = !!(req.isAuthenticated() && req.user);
    next()
}

const validateVerification = async (req, res,next) => {
    const userFromEmail = await User.findOne({email: req.body.email})

    const verifyMessage = ['Please verify your email.']
    const registerUserMessage = ['Wrong email ID or Password']
    if (userFromEmail) {
            if (userFromEmail.email_verified === false) {
                res.render("auth/login", {
                    auth: req.isLoggedIn, user: req.user, messages: verifyMessage,
                    hasMessages: verifyMessage.length > 0,
                })
            } else {
                next();
            }

    }
    else {
        res.render("auth/login", {
            auth: req.isLoggedIn, user: req.user, messages: registerUserMessage,
            hasMessages: verifyMessage.length > 0
        })

    }

}


module.exports = {
    isAuthenticated,
    authInfo,
    validateVerification
}