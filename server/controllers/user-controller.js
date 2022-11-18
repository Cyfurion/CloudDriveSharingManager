const User = require('../models/user-model');

getUser = async (req, res) => {
    let str = req.params.profile;
    let profile = [str.substring(0,str.lastIndexOf(',')), str.substring(str.lastIndexOf(',')+1)];
    const user = await User.findOne({ profile: profile });
    return res.status(200).json(user).send();
}

module.exports = {
    getUser
}
