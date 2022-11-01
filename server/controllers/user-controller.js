const mongoose = require('mongoose');
const Snapshot = require('../models/snapshot-model');
const User = require('../models/user-model');

addSnapshot = async (req, res) => {
    const payload = req.body;
    let user = await User.findOne({ profile: payload.profile });

    snapshotID = new mongoose.Types.ObjectId();
    const newSnapshot = new Snapshot({
        _id: snapshotID,
        contents: JSON.stringify(payload)
    });
    if (user) {
        user.fileSnapshotIds.push(snapshotID);
    } else {
        user = new User({
            profile: payload.profile,
            fileSnapshotIds: [snapshotID]
        });
        
    }
    await user.save();
    await newSnapshot.save();
    return res.status(201).json({ success: true }).send();
}

getUser = async (req, res) => {
    const user = await User.findOne({ profile: req.body.profile });
    return res.status(200).json(user).send();
}

module.exports = {
    addSnapshot,
    getUser
}
