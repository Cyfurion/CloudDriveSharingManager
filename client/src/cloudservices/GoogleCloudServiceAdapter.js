import { CloudServiceAdapter } from './CloudServiceAdapter';

import { File, Folder } from '../classes/file-class';
import FileSnapshot from '../classes/filesnapshot-class';
import Permission from '../classes/permission-class';
import Query from '../snapshotoperations/Query'
import { findFileFolderSharingDifferences } from '../snapshotoperations/SharingAnalysis';
import GroupSnapshot from '../classes/groupsnapshot-class';

export class GoogleCloudServiceAdapter extends CloudServiceAdapter {
    PermissionTypes = {
        owner: 'owner',
        organizer: 'organizer',
        fileOrganizer: 'fileOrganizer',
        writer: 'writer',
        commenter: 'commenter',
        reader: 'reader'
    }
    
    deploy() {
        //TODO not implemented
    }
    
    async takeGroupSnapshot(snapshotString, groupEmail, timestamp) {
        let members = snapshotString.match(/"mailto:[^"]*"/g);
        members = members.map(member =>  member.substring('"mailto:'.length, member.length-1));
        console.log(new GroupSnapshot(this.getProfile(), members, groupEmail, timestamp));
        return new GroupSnapshot(this.getProfile(), members, groupEmail, timestamp);
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
            let currentFile = await this.createFileObject(files[i]);
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
        let rootFile = new File("", "root", [], "", "", "SYSTEM", "/", "", "");
        let root = new Folder(rootFile, []);
        let myDrive = new Folder(new File(await this.getRootID(), "My Drive", [], "", "", "SYSTEM", "/myDrive", "", "SYSTEM"), []);
        root.files.push(myDrive);
        snapshotHelper(parentToChildMap, myDrive);
        let sharedWithMe = new Folder(new File("", "Shared With Me", [], "", "", "SYSTEM", "/sharedWithMe", "", "SYSTEM"), []);
        root.files.push(sharedWithMe);
        snapshotHelper(parentToChildMap, sharedWithMe);
        let snap = new FileSnapshot(
            this.getProfile(),
            root, 
            (new Date()).toString()
        );
        return snap;
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
                'fields': 'files(id,name,createdTime,permissions,parents,owners,sharingUser),nextPageToken',
                'pageSize': 1000,
                'pageToken': token,
                'q': 'trashed = false'
            })).result;
            files = files.concat(response.files);
            token = response.nextPageToken;
        } while (token);
        return files;
    }

    /**
     * Converts a Google Drive API file into a CDSM file.
     * @param file the Google Drive API file structure to convert
     * @returns CDSM File object
     */
    async createFileObject(file) {
        let id = file.id;
        let name = file.name;
        let permissions = [];
        let permissionIds = [];
        if (file.permissions !== undefined) {
            for (let i = 0; i < file.permissions.length; i++) {
                let permission = file.permissions[i];
                let canShare = (permission.role === this.PermissionTypes.owner
                        || permission.role === this.PermissionTypes.organizer 
                        || permission.role === this.PermissionTypes.fileOrganizer
                        || permission.role === this.PermissionTypes.writer);
                permissions.push(new Permission(permission.type, permission.type === 'anyone' ? 'anyone' : 
                    permission.emailAddress, permission.role, false, canShare));
                permissionIds.push(permission.id);
            }
        }
        let drive = "";
        if (file.driveId !== undefined) {
            drive = file.driveId;
        }
        let owner = file.owners[0].emailAddress;
        let createdTime = file.createdTime;
        let sharedBy = owner;
        if(file.sharingUser){
            sharedBy = file.sharingUser.emailAddress;
        }
        return new File(id, name, permissions, permissionIds, drive, owner, "", createdTime, sharedBy);
    }
}

/**
 * Helper method to recursively make snapshot tree.
 * @param parentToChildMap Map to get subfiles
 * @param folder Folder that CDSM is currently populating
 */
function snapshotHelper(parentToChildMap, folder) { //add paths to files
    let childrenList = parentToChildMap.get(folder.id);
    if(childrenList){
        for (let i = 0; i < childrenList.length; i++) {
            childrenList[i].path = folder.path + "/" + childrenList[i].name;
            if (parentToChildMap.has(childrenList[i].id)) {
                // childrenList[i] is folder
                let newFolder = new Folder(childrenList[i], []);
                childrenList[i] = newFolder;
                snapshotHelper(parentToChildMap, newFolder);
            }
        }
    }
    for(let child of childrenList){
        for(let i = 0; i< child.permissionIds.length; i++){
            if(folder.permissionIds.includes(child.permissionIds[i])){
                child.permissions[i].isInherited = true;
            }
        }
    }
    folder.files = childrenList;
}


