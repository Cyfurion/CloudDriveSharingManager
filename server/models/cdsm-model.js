const mongoose = require("mongoose");
const AccessControlRequirement = require("../classes/accesscontrolrequirement-class");
const FileSnapshot = require("../classes/filesnapshot-class");
const GroupSnapshot = require("../classes/groupsnapshot-class");
const Schema = mongoose.Schema;

const CDSMSchema = new Schema(
    {
        id: { type: String, required: true },
        acrs: { type: [AccessControlRequirement], required: false },
        filesnapshots: { type: [FileSnapshot], required: true },
        groupsnapshots: { type: [GroupSnapshot], required: false }
    }
);

module.exports = mongoose.model("user", CDSMSchema);
