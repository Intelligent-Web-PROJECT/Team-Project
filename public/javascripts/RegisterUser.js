const User = require('../../models/schema/user');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res) => {
    const { nickname, password, confirmPassword } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        console.log("inside try")
        // Check if the nickname already exists
        const existingUser = await User.findOne({ nickname });

        console.log("user: "+existingUser)
        if (existingUser) {
            return res.status(400).json({ message: 'Nickname already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(nickname+" "+hashedPassword)

        // Create a new user
        const newUser = new User({
            nickname,
            password: hashedPassword
        });

        console.log(newUser)

        // Save the user to the database
        await newUser.save();

        res.status(201).redirect('/');
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

const loginUser = async(req, res) => {
    const {loginNickname, loginPassword} = req.body;

    try {
        // Check if the user exists
        const existingUser = await User.findOne({ nickname: loginNickname });
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid nickname or password' });
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(loginPassword, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid nickname or password' });
        }

        // Respond with a success message and optionally the token
        res.status(200).redirect('/allPlants')

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user', error });
    }
}

module.exports = {
    registerUser,
    loginUser
}