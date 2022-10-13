const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        id: { type: [String], required: true },
        acrs: { type: [String], required: false },
        fileSnapshotsIds: { type: [String], required: true },
        groupSnapshots: { type: [String], required: false }
    }
);

module.exports = mongoose.model("user", UserSchema);
