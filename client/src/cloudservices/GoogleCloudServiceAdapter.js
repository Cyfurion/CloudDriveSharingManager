import { CloudServiceAdapter } from './CloudServiceAdapter';

import { File, Folder } from '../classes/file-class';
import FileSnapshot from '../classes/filesnapshot-class';
import Permission from '../classes/permission-class';

export class GoogleCloudServiceAdapter extends CloudServiceAdapter {
    deploy() {
        //TODO not implemented
    }

    /**
     * Takes in a list of Google API files and creates a snapshot tree from it.
     * @param files 
     * @returns snapshot tree
     */
    async takeSnapshot() {
        let files = await this.retrieve();
        let parentToChildMap = new Map();
        // making map of key = parent and value = list of children
        for (let i = 0; i < files.length; i++) {
            // change this when adding to file schema
            let currentFile = createFileObject(files[i]);
            if (files[i].parents === undefined) {
                files[i].parents = [""];
            }
            for (let j = 0; j < files[i].parents.length; j++) {
                if (!parentToChildMap.has(files[i].parents[j])) {
                    parentToChildMap.set(files[i].parents[j], [currentFile]);
                } else {
                    parentToChildMap.get(files[i].parents[j]).push(currentFile);
                }   
            }   
        }
        let rootFile = new File("", "root", [], "", "", "SYSTEM", "/", "");
        let root = new Folder(rootFile, []);
        let myDrive = new Folder(new File(await this.getRootID(), "My Drive", [], "", "", "SYSTEM", "/myDrive", ""), []);
        root.files.push(myDrive);
        snapshotHelper(parentToChildMap, myDrive);
        let sharedWithMe = new Folder(new File("", "Shared With Me", [], "", "", "SYSTEM", "/sharedWithMe", ""), []);
        root.files.push(sharedWithMe);
        snapshotHelper(parentToChildMap, sharedWithMe);
        return new FileSnapshot(
            this.getProfile(),
            root, 
            (new Date()).toString()
        );
    }

    getProfile() {
        return [this.endpoint.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail(), "Google Drive"];
    }

    async getRootID() {
        let response = (await this.endpoint.client.drive.files.list({
            'fields': 'files(parents),nextPageToken',
            'pageSize': 1,
            'q': "'root' in parents"
        })).result;
        if (response.files.length) {
            return response.files[0].parents[0];
        } else {
            return "";
        }
    }

    // Returns an array of every un-trashed file accessible to the user.
    async retrieve() {
        let files = [];
        let token = "";
        do {
            let response = (await this.endpoint.client.drive.files.list({
                'fields': 'files(id,name,createdTime,permissions,parents,owners),nextPageToken',
                'pageSize': 1000,
                'pageToken': token,
                'q': 'trashed = false'
            })).result;
            files = files.concat(response.files);
            token = response.nextPageToken;
        } while (token);
        return files;
    }
}

/**
 * Helper method to recursively make snapshot tree.
 * @param parentToChildMap Map to get subfiles
 * @param folder Folder that CDSM is currently populating
 */
function snapshotHelper(parentToChildMap, folder) { //add paths to files
    let childrenList = parentToChildMap.get(folder.id);
    for (let i = 0; i < childrenList.length; i++) {
        childrenList[i].path = folder.path + "/" + childrenList[i].name;
        if (parentToChildMap.has(childrenList[i].id)) {
            // childrenList[i] is folder
            let newFolder = new Folder(childrenList[i], []);
            childrenList[i] = newFolder;
            snapshotHelper(parentToChildMap, newFolder);
        }
    }
    folder.files = childrenList;
}

/**
 * Converts a Google Drive API file into a CDSM file.
 * @param file the Google Drive API file structure to convert
 * @returns CDSM File object
 */
function createFileObject(file) {
    let id = file.id;
    let name = file.name;
    let permissions = [];
    let permissionIds = [];
    if (file.permissions !== undefined) {
        for (let i = 0; i < file.permissions.length; i++) {
            let permission = file.permissions[i];
            permissions.push(new Permission(permission.type, permission.type === 'anyone' ? 'anyone' : 
                permission.emailAddress, permission.role === 'reader' ? 'read' : 'write'));//TODO fix for dropbox
            permissionIds.push(permission.id);
        }
    }
    let drive = "";
    if (file.driveId !== undefined) {
        drive = file.driveId;
    }
    let owner = file.owners[0].emailAddress;
    let createdTime = file.createdTime;
    return new File(id, name, permissions, permissionIds, drive, owner, "", createdTime);
}
