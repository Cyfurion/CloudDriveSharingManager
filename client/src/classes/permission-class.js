class Permission {
    constructor(type, entity, role, isInherited) {
        this.type = type; // user, group, domain
        this.entity = entity;// associated domain or emails
        this.role = role; // read, write
        this.isInherited = isInherited;
    }
}

module.exports = Permission;
