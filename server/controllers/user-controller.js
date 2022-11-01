const User = require('../models/user-model');

getUser = async (req, res) => {
    const user = await User.findOne({ profile: req.body.profile });
    return res.status(200).json(user).send();
}

module.exports = {
    getUser
}
