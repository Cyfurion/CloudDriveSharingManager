import { CloudServiceAdapter } from "./CloudServiceAdapter";

import { File, Folder } from "../classes/file-class";
import FileSnapshot from '../classes/filesnapshot-class';
import Permission from '../classes/permission-class';

export class DropboxCloudServiceAdapter extends CloudServiceAdapter { 
    roleTypes = {
        user: 'user'
    }
    
    permissionTypes = {
        owner: 'owner',
        editor: 'editor',
        viewer: 'viewer'
    }

    writable = [this.permissionTypes.owner, this.permissionTypes.editor];

    async deploy(files, deletePermissions, addPermissions) {
        const promises = [];
        for (let file of files) {
            // Delete specified permissions (if they exist).
            for (let i = 0; i < file.permissions.length; i++) {
                if (deletePermissions.includes(file.permissions[i].entity) && file.permissions[i].role !== "owner") {
                    // Matching permission found, delete.
                    const payload = { email: file.permissions[i].entity }
                    payload['.tag'] = 'email';
                    if (file instanceof Folder) {
                        promises.push(this.endpoint.sharingRemoveFolderMember({
                            shared_folder_id: file.id,
                            member: payload
                        }));
                    } else {
                        promises.push(this.endpoint.sharingRemoveFileMember2({
                            file: file.path,
                            member: payload
                        }));
                    }
                }
            }
            // Add all permissions to this file.
            for (let permission of addPermissions) {
                const payload = { email: permission.entity }
                payload['.tag'] = 'email';
                if (file instanceof Folder) {
                    promises.push(this.endpoint.sharingAddFileMember({
                        shared_folder_id: file.id,
                        members: [payload]
                    }));
                } else {
                    const accessLevel = { }
                    accessLevel['.tag'] = permission.role;
                    promises.push(this.endpoint.sharingAddFolderMember({
                        file: file.path,
                        members: [payload],
                        access_level: accessLevel
                    }));
                }
            }
        }
        await Promise.all(promises);
    }
    /**
     * Given a list of `File` objects, checks whether these files have matching (up-to-date) permissions with their
     * counterparts in the cloud drive.
     * @param {File[]} files The list of files to check.
     * @returns `true` if the local files permissions match the cloud drive files permissions, and `false` otherwise.
     */
     async deployValidatePermissions(files) {
        for (let file of files) {
            let upstreamPermissions;
            try {
                if (file instanceof Folder) {
                    upstreamPermissions = (await this.endpoint.sharingListFolderMembers({ shared_folder_id: file.id })).result.users;
                } else {
                    upstreamPermissions = (await this.endpoint.sharingListFileMembers({ file: file.path })).result.users;
                }
            } catch {
                // File wasn't found.
                return false;
            }
            if (file.permissions.length !== upstreamPermissions.length) {
                return false;
            }
            outer: for (let i = 0; i < file.permissions.length; i++) {
                for (let k = 0; k < upstreamPermissions.length; k++) {
                    if (upstreamPermissions[k].user.email.toLowerCase() === file.permissions[i].entity.toLowerCase()) {
                        continue outer;
                    }
                }
                return false;
            }
        }
        return true;
    }

    async takeSnapshot() {
        let rootFile = new File("", "root", [], "", "dropbox", "SYSTEM", "/", "");
        let root = new Folder(rootFile, []);
        await this.takeSnapshotHelper(root, '');
        return new FileSnapshot(await this.getProfile(), root, (new Date()).toString());
    }

    async getProfile() {
        return [(await this.endpoint.usersGetCurrentAccount()).result.email, "Dropbox"];
    }

    async takeSnapshotHelper(folder, path) {
        let response = await this.endpoint.filesListFolder({ path: path });
        let isRoot = (folder.id === '');
        if(isRoot){
            folder.owner = (await this.getProfile())[0];
        }
        for (let element of response.result.entries) {
            let newFile = await this.createFileObject(element, folder);
            if (element[".tag"] === "folder") {
                let newFolder = new Folder(newFile, []);
                await this.takeSnapshotHelper(newFolder, path + "/" + element.name);
                folder.files.push(newFolder);
            } else {
                folder.files.push(newFile);
            }
        }
        if(isRoot){
            folder.owner = 'SYSTEM';
        }
    }
    
    async createFileObject(file, parent) {
        let id = file.id;
        let name = file.name;
        let permissions = [];
        let permissionIds = [];
        let owner = parent.owner;
        let sharedFolderId = "";
        let pathParameter = '';
        if(parent.path === '/'){
            pathParameter = parent.path + file.name;
        }else{
            pathParameter = parent.path + "/" + file.name;
        }
        let hasExplicitPermissions = (await this.endpoint.filesGetMetadata({
                "include_deleted": false,
                "include_has_explicit_shared_members": true,
                "include_media_info": false,
                "path": pathParameter
            })).result.has_explicit_shared_members;
        let directFilePermissions = undefined;
        if(hasExplicitPermissions){
            directFilePermissions = await this.endpoint.sharingListFileMembers({
                "file": pathParameter,
                "include_inherited": true
            });
        }
        if (file.shared_folder_id) {
            permissionIds.push(file.sharedFolderId);
            sharedFolderId = file.shared_folder_id;
            id = sharedFolderId;
        }else if(file.parent_shared_folder_id){
            sharedFolderId = file.parent_shared_folder_id;
        }
        let folderPermissions = undefined;
        if (sharedFolderId !== "" && !directFilePermissions) {
            folderPermissions = await this.endpoint.sharingListFolderMembers({"shared_folder_id": sharedFolderId});
        }
        if (directFilePermissions) {
            for (let user of directFilePermissions.result.users) {
                let type = 'user'; 
                let entity = user.user.email;
                if (user.access_type[".tag"] === owner) {
                    owner = user.user.email;
                }
                let role = user.access_type[".tag"];
                let isInherited = user.is_inherited;
                if (file[".tag"] !== "folder") {
                    isInherited = true;
                }
                let p = new Permission(type, entity, role, isInherited, true);//all files are shareable by people who have access
                permissions.push(p);
            }
        }else if (folderPermissions) {
            for (let user of folderPermissions.result.users) {
                let type = 'user'; 
                let entity = user.user.email;
                if (user.access_type[".tag"] === owner) {
                    owner = user.user.email;
                }
                let role = user.access_type[".tag"];
                let isInherited = user.is_inherited;
                if (file[".tag"] !== "folder") {
                    isInherited = true;
                }
                let p = new Permission(type, entity, role, isInherited, true);//all files are shareable by people who have access
                permissions.push(p);
            }
        }
        let createdTime = 'N/A';
        if (file.client_modified) {
            createdTime = file.client_modified;
        }
        return new File(id, name, permissions, permissionIds, 'dropbox', owner, file.path_display, createdTime, "");
        //dropbox doesnt have sharedby
    }
}

