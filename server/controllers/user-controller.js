const User = require('../models/user-model');

getUser = async (req, res) => {
    const user = await User.findOne({ id: req.id });
    return res.status(200).json(user).send();
}

module.exports = {
    getUser
}
