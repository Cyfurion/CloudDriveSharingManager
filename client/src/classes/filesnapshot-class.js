class FileSnapshot {
    constructor(profile, root, timestamp) {
        this.profile = profile;
        this.root = root;
        this.timestamp = timestamp;
    }

    validate(acrs) {
        return false;
    }
}

module.exports = FileSnapshot;
