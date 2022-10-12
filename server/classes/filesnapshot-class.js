class FileSnapshot {
    constructor(profile, rootFiles, timestamp){
        this.profile = profile;
        this.rootFiles = rootFiles;
        this.timestamp = timestamp;
    }

    validate(acrs) {
        return false;
    }
}

module.exports = FileSnapshot;
