const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CDSMSchema = new Schema(
    {
        id: { type: [String], required: true },
        acrs: { type: [String], required: false },
        filesnapshots: { type: [String], required: true },
        groupsnapshots: { type: [String], required: false }
    }
);

module.exports = mongoose.model("user", CDSMSchema);
