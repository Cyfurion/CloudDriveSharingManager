import { File, Folder } from "./file-class";
import Query from "../snapshotoperations/Query";
import Permission from "./permission-class";

export default class FileSnapshot {
    constructor(profile, root, timestamp) {
        this.profile = profile;
        this.root = root;
        this.timestamp = timestamp;
    }

    validate(acrs, snapshot) {
        const violations = new Map();
        for (let acr of acrs) {
            const acrViolations = {
                ar: [],
                aw: [],
                dr: [],
                dw: []
            }
            const files = (new Query(acr.query, snapshot)).evaluate()
            for (let file of files) {
                for (let permission of file.permissions) {
                    if (acr.allowedReaders.length > 0) {
                        // Check allowed readers.
                        if (!acr.allowedReaders.includes(permission.entity) 
                            && !acr.allowedReaders.includes(permission.entity.split("@").pop())) {
                            acrViolations.ar.push(permission.entity);
                        }
                    }
                    if (acr.allowedWriters.length > 0) {
                        // Check allowed writers.
                        if (permission.role === "writer"
                            && !acr.allowedReaders.includes(permission.entity) 
                            && !acr.allowedReaders.includes(permission.entity.split("@").pop())) {
                            acrViolations.aw.push(permission.entity);
                        }
                    }
                    if (acr.deniedReaders.length > 0) {
                        // Check denied readers.
                        if (acr.deniedReaders.includes(permission.entity) 
                            || acr.deniedReaders.includes(permission.entity.split("@").pop())) {
                            acrViolations.dr.push(permission.entity);
                        }
                    }
                    if (acr.deniedWriters.length > 0) {
                        // Check denied writers.
                        if (permission.role === "writer"
                            && (acr.deniedWriters.includes(permission.entity) 
                            || acr.deniedWriters.includes(permission.entity.split("@").pop()))) {
                            acrViolations.dw.push(permission.entity);
                        }
                    }
                }
            }
            violations.set(acr.query, acrViolations);
        }
        return violations;
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
