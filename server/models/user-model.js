const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        id: { type: [String], required: true, unique: true },
        acrs: { type: [String], required: false },
        fileSnapshotIds: { type: [mongoose.Types.ObjectId], required: true },
        groupSnapshots: { type: [String], required: false }
    }
);

module.exports = mongoose.model("user", UserSchema);
