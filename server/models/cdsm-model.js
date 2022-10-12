const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CDSMSchema = new Schema(
    {
        id: { type: String, required: true },
        acr: { type: [String], required: false }
    }
);

module.exports = mongoose.model("user", CDSMSchema);
