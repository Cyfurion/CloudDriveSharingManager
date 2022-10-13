const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SnapshotSchema = new Schema(
    {
        snapshotId: { type: String, required: true },
        contents: { type: String, required: true },
    }
);

module.exports = mongoose.model("snapshot", SnapshotSchema);