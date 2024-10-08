const { User } = require("../models/user");
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, phoneNumber } = req.body;

    await User.findOne({email : email})
    .then(async (foundUser) => {
        if(foundUser){
            res.json({message : "User Already exists"})
        }else{
            const user = new User({ email, password, role, firstName, lastName, phoneNumber });
            await user.save();
            res.status(201).json({ message: 'User registered successfully' });
        }
    })

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(password == user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // res.json({ token });

    res.json({message : "Signed into the portal"})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const user = await User.findById(req.user.userId);
    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};