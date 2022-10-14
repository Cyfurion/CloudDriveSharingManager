class File {
    constructor(id, name, permissions) {
        this.id = id;
        this.name = name;
        this.permissions = permissions;
    }
}

class Folder extends File {
    constructor(id, name, permissions, files) {
        super(id, name, permissions);
        this.files = files;
    }
}

module.exports = {
    File,
    Folder
}

