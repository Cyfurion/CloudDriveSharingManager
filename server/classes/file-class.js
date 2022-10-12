class File {
    constructor(name, id, permissions, parent){
        this.name = name;
        this.id = id;
        this.permissions = permissions;
        this.parent = parent;
    }
}

class Folder extends File {
    constructor(file, files){
        super(file);
        this.files = files;
    }
}

module.exports = {
    File,
    Folder
}
