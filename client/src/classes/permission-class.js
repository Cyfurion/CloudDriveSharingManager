class Permission {
    constructor(id, type, entity, role) {
        this.id = id; 
        this.type = type; // user, group, domain
        this.entity = entity;// associated domain or emails
        this.role = role; // read, write, comment
    }
}

module.exports = {
    Permission
}