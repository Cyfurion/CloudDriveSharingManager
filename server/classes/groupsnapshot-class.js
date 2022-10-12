class GroupSnapshot {
    constructor(profile, groups, groupEmail, timestamp) {
        this.profile = profile;
        this.groups = groups;
        this.groupEmail = groupEmail;
        this.timestamp = timestamp;
    }
}

module.exports = GroupSnapshot;
