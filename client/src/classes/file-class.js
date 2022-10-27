class File {
    constructor(id, name, permissions, drive, owner, path, createdTime) {//creator, path, createdTime) {
        this.id = id;
        this.name = name;
        this.permissions = permissions;
        this.drive = drive;
        this.owner = owner;
        //this.creator = creator; TODO what is this
        this.path = path;
        this.createdTime = createdTime;
    }
}

class Folder extends File {
    constructor(file, files) {
        super(file.id, file.name, file.permissions, file.drive, file.owner, file.path, file.createdTime);
        this.files = files;
    }
}

module.exports = {
    File,
    Folder
}

