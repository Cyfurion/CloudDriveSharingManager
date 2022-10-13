class AccessControlRequirement {
    constructor(profile, query, AR, AW, DR, DW) {
        this.profile = profile;
        this.query = query;
        this.allowedReaders = AR;
        this.allowedWriters = AW;
        this.deniedReaders = DR;
        this.deniedWriters = DW;
    }
}

module.exports = AccessControlRequirement;
