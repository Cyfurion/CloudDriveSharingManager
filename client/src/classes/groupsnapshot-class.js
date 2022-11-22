class GroupSnapshot {
    constructor(profile, members, groupEmail, timestamp) {
        this.profile = profile;
        this.members = members;
        this.groupEmail = groupEmail;
        this.timestamp = timestamp;
    }
}

module.exports = GroupSnapshot;
