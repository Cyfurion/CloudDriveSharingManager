const mongoose = require('mongoose');
const User = require('../models/user-model');

addACR = async (req, res) => {
    const user = await User.findOne({ profile: req.body.profile });
    user.acrs.push(JSON.stringify(req.body));
    await user.save();
    await mongoose.syncIndexes();
    return res.status(201).json({ success: true }).send();
}

deleteACR = async (req, res) => {
    const user = await User.findOne({ profile: req.body });
    user.acrs.splice(req.params.index);
    await user.save();
    await mongoose.syncIndexes();
    return res.status(200).json({ success: true }).send();
}

getUser = async (req, res) => {
    const str = req.params.profile;
    const profile = [str.substring(0, str.lastIndexOf(',')), str.substring(str.lastIndexOf(',') + 1)];
    const user = await User.findOne({ profile: profile });
    return res.status(200).json(user);
}

module.exports = {
    addACR,
    deleteACR,
    getUser
}
