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

    deploy() {
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
                "include_inherited": false
            });
        }
        if (file.shared_folder_id) {
            sharedFolderId = file.shared_folder_id;
        }else if(file.parent_shared_folder_id){
            sharedFolderId = file.parent_shared_folder_id;
        }
        let folderPermissions = undefined;
        if (sharedFolderId !== "") {
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
        }
        if (folderPermissions) {
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

