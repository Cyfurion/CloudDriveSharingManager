import { CloudServiceAdapter } from "./CloudServiceAdapter";

import { File, Folder } from "../classes/file-class";
import FileSnapshot from '../classes/filesnapshot-class';
import Permission from '../classes/permission-class';

export class DropboxCloudServiceAdapter extends CloudServiceAdapter { 
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
        let permissionsMap = new Map();
        let sharedFolderId = "";
        if (file.shared_folder_id) {
            sharedFolderId = file.shared_folder_id;
        }else if(file.parent_shared_folder_id){
            sharedFolderId = file.parent_shared_folder_id;
        }
        //creating permissions map
        for (let i = 0; i < permissions.length; i++) {
            permissionsMap.set(permissionIds[i], permissions[i]);
        }
        let dropboxPermissions = undefined;
        if (sharedFolderId !== "") {
            //use this to find group and user permissions
            dropboxPermissions = await this.endpoint.sharingListFolderMembers({"shared_folder_id": sharedFolderId});
        }
        if (dropboxPermissions) {
            for (let user of dropboxPermissions.result.users) {
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
                permissionIds.push(file.shared_folder_id);
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

