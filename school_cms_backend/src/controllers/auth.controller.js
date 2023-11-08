const NotFoundException = require('../exceptions/NotFoundException');
const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body,'req.body');
    //validation
    const user = new User({ username, password });
    // hash password
    await user.hashPassword();
    await user.save();

    // generateToken can happen in different stage: 
    // 1. when user register successfully
    // 2. generateToken when user register successfully, but cannot use until user validate by email
    // 3. generateToken until user validate by email 
    // 4. when user login successfully
    const token = generateToken({_id: user._id, username, role:'admin'});

    res.status(201).json({token});
}

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).exec();
    if (!user) {
        // can return 404 or 401 depends on what info we want to return to user: user not found? or info not correct? 
        throw new NotFoundException('User not found');
    }
    const validatePassword = await user.validatePassword(password);
    if (!validatePassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    res.json({
        _id: user._id,
        username: user.username,
    });
};

module.exports = {register,login};