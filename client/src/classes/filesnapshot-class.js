import { File, Folder } from "../classes/file-class";
import Permission from "./permission-class";

export default class FileSnapshot {
    constructor(profile, root, timestamp) {
        this.profile = profile;
        this.root = root;
        this.timestamp = timestamp;
    }

    validate(acrs) {
        return false;
    }

    deserialize(str) {
        const obj = JSON.parse(str);
        this.profile = obj.profile;
        this.timestamp = obj.timestamp;
        this.root = new Folder(obj.root, obj.root.files)
        for (let i = 0; i < this.root.files.length; i++) {
            this.root.files[i] = this.deserializeHelper(this.root.files[i]);
        }
        return this;
    }

    deserializeHelper(obj) {
        if ('files' in obj) {
            // Deserialize folder.
            let folder = new Folder(obj, obj.files);
            folder.permissions = folder.permissions.map(p => Object.assign(new Permission(), p));
            folder.files = folder.files.map(f => this.deserializeHelper(f));
            return folder;
        } else {
            // Deserialize file.
            let file = Object.assign(new File(), obj);
            file.permissions = file.permissions.map(p => Object.assign(new Permission(), p));
            return file;
        }
    }
}
