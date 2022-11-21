class Permission {
    constructor(type, entity, role, isInherited, canShare) {
        this.type = type; // user, group, domain
        this.entity = entity;// associated domain or emails
        this.role = role; // read, write, comment
        this.isInherited = isInherited;
        this.canShare = canShare;
    }
}

module.exports = Permission;
