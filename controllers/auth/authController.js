const {pbkdf2, randomBytes} = require("node:crypto")
const {promisify} = require("node:util");
const {User} = require("../../models/models");
const {email} = require("../../public/javascripts/Emailing");
const {showErrorMessage} = require("../../util/ErrorMessage");
const pbkdf2Promise = promisify(pbkdf2)
let token=""


function getLoginPage(req, res) {
    const messages = req.flash('error');
    res.render('auth/login', {
        auth: req.isLoggedIn,
        user: req.user,
        messages,
        hasMessages: messages.length > 0
    });
}
function getRegisterPage(req, res) {
    const messages = req.flash('error');
    res.render('auth/register', {
        auth: req.isLoggedIn,
        user: req.user,
        messages,
        hasMessages: messages.length > 0
    });
}

const logoutUser = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy(err => {
            if (err) return next(err);
            res.redirect("/login");
        });
    });
};

const registerUser = async (req, res, next) => {
    const {username, email, password, confirmPassword} = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password || !confirmPassword) {
        return res.render("auth/register", {
            messages: ['All fields are required'],
            hasMessages: true,
            auth: req.isLoggedIn,
            user: req.user
        });
    }

    let messages;

    // Check if password and confirmPassword match
    if (password === confirmPassword) {
        try {
            const emailCheck = await User.findOne({email});
            const usernameCheck = await User.findOne({username})

            if (emailCheck) {
                messages = ['User email already exists'];
                return res.render("auth/register", {
                    messages: messages,
                    hasMessages: messages.length > 0,
                    auth: req.isLoggedIn,
                    user: req.user
                });
            }
            if (usernameCheck) {
                messages = ['Username already taken'];
                return res.render("auth/register", {
                    messages: messages,
                    hasMessages: messages.length > 0,
                    auth: req.isLoggedIn,
                    user: req.user
                });
            }
            else {
                const salt = randomBytes(16);
                const hashedPassword = await pbkdf2Promise(password, salt, 310000, 32, 'sha256');
                const newUser = {
                    username: username,
                    email: email,
                    password: hashedPassword,
                    salt: salt
                };

                if (req.session.messages.length > 0) {
                    return res.redirect("/register")
                }

                let user = new User(newUser);
                const userData = await user.save()

                if(userData)
                {
                    const messages = ['Verification link has been sent to your email. Please verify email.']
                    sendVerifyEmail(req.body.username, req.body.email, userData._id)
                    console.log(userData._id)

                    req.login(user, err => {
                        if (err)
                            return next(err)
                        res.render("auth/login", {auth: req.isLoggedIn, user:req.user, messages: messages,
                            hasMessages: messages.length > 0,})
                    })
                }
                else
                {
                    res.send("Error in registering")
                }
            }
        } catch (error) {
            // Handle any errors that may occur during the registration process
            console.error("Error registering user:", error);
            messages = ['An error occurred during registration. Please try again later.'];
            return res.render("auth/register", {
                messages: messages,
                hasMessages: messages.length > 0,
                auth: req.isLoggedIn,
                user: req.user
            });
        }
    } else {
        return res.render("auth/register", {
            messages: ['Passwords do not match'],
            hasMessages: true,
            auth: req.isLoggedIn,
            user: req.user
        });
    }
};

const sendVerifyEmail = (name, userEmail, user_id) => {
    const subject = "FloraScan Verification"
    const message = `<p>Dear ${name},<br><br> Please click <a href="${process.env.BASE_URL}:${process.env.PORT}/verify?id=${user_id}">here</a> to verify your email. <br><br> Regards,<br><p style="color: #2E8B57">Team FloraScan</p></p>`
    email(userEmail, subject, message)
}

const verifyEmail = async(req, res) => {
    try {
        const updateInfo = await User.updateOne({_id: req.query.id},
            {
                $set:{email_verified:true}
            })
        console.log(updateInfo)
        res.render("auth/verify")
    }
    catch (err){
        console.log(err)
    }
}

function getForgotPassword(req, res, next){
    res.render('auth/forgot-password', {auth: req.isLoggedIn, user:req.user})
}


function getResetPasswordPage(req, res, next) {
    res.render('auth/reset-password', { auth: req.isLoggedIn, user: req.user });
}


//-------------------------------------------------- Finding user to send reset password link via email --------------------------------------------------------------//
async function getForgotUser(req, res, next) {
    const { resetEmail } = req.body;
    token = generateRandomToken();
    try {
        const user = await User.findOneAndUpdate(
            { email: resetEmail },
            { token: token }
        );
        if(user) {

            // Generate the reset password link
            const link = resetPasswordLink(token);

            // You can send the link to the user's email or provide it in the response
            //res.send(`Copy the token = ${token} and paste in the link Reset password link: ${link}`);
            res.send("Messsage has been sent to your email. Please follow the steps")
            const subject = "Password Reset - ePanda"
            const message = `Reset password link: ${link} <br><br> Regards,<br><p style="color: #2E8B57">Team Panda</p>`
            email(resetEmail, subject, message )
        }
        else
        {
            res.send('User not found')
        }
    } catch (err) {
        console.error("Error generating reset token:", err);
        res.status(500).send('Error generating reset token');
    }
}

//--------------------------------------------------- Creating a token for the reset session --------------------------------------------------------------//
const generateRandomToken = (length = 32) => {
    return randomBytes(length).toString('hex');
};

//--------------------------------------------------- Generating a reset password link --------------------------------------------------------------//
const resetPasswordLink = (token) => {
    const {BASE_URL, PORT} = process.env
    // Assuming your application is running on localhost:3000, adjust accordingly if not
    const baseUrl = `${BASE_URL}:${PORT}`;
    return `${baseUrl}/reset-password?token=${token}`;
};

//--------------------------------------------------- resetting  password --------------------------------------------------------------//
const resetPassword = async (req, res, next) => {
    try {
        const { password, confirmPassword } = req.body;

        // Find the user by the reset token
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).send("User not found or invalid token");
        }

        // Check if the provided passwords match
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match");
        }

        // Hash the new password and update user record
        const salt = randomBytes(16);
        const hashedPassword = await pbkdf2Promise(password, salt, 310000, 32, 'sha256');
        await User.findOneAndUpdate(
            { _id: user._id },
            { password: hashedPassword, salt: salt, token: null },
            { new: true }
        );

        // Password reset successful
        res.status(200).redirect('/login');
        token = "";
    } catch (err) {
        console.error("Error resetting password:", err);
        res.status(500).send("Error resetting password");
    }
};


module.exports = {
    getLoginPage,
    getRegisterPage,
    registerUser,
    verifyEmail,
    getForgotPassword,
    getForgotUser,
    getResetPasswordPage,
    resetPassword,
    logoutUser

}