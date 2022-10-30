import { File, Folder } from "../classes/file-class";
import { CloudServiceAdapter } from "./CloudServiceAdapter";
import { Permission } from '../classes/permission-class';
import FileSnapshot from '../classes/filesnapshot-class';

export class DropboxCloudServiceAdapter extends CloudServiceAdapter {
    deploy() {
        //TODO not implemented
    }

    // Returns an array of every file accessible to the user.
    async retrieve() {

        let files = [];
        let response = await this.endpoint.filesListFolder({ 
            path: '',
            recursive: true
        });
        // TODO: TEMPORARY
        for (let element of response.result.entries) {
            files.push({ 
                name: element.name,
                owners: [{ emailAddress: "Unknown: Dropbox File" }],
                createdTime: element.client_modified
            });
        }
        console.log(await makeSnapshot(this.endpoint));
        //await makeSnapshot(this.endpoint);
        return files;
    }
}

async function makeSnapshot(endpoint){
    let rootFile = new File("root", "root", [], [], "dropbox"
        , "TODO SOME EMAIL", "/root", "N/A");
    let root = new Folder(rootFile, []);
    await makeSnapshotHelper(root, '', endpoint);
    return new FileSnapshot(
        ["TODO SOME EMAIL", "Dropbox"], 
        root, 
        (new Date()).toString()
    );
}

async function makeSnapshotHelper(folder, path, endpoint){
    let response = await endpoint.filesListFolder({ 
        path: path
    });
    for (let element of response.result.entries) {
        let newFile = await createFileObject(element, folder, endpoint);
        if(element[".tag"] === "folder"){
            let newFolder = new Folder(newFile, []);
            await makeSnapshotHelper(newFolder, path + "/" + element.name, endpoint);
            folder.files.push(newFolder);
        }else{
            folder.files.push(newFile);
        }
    }
}

async function createFileObject(file, parent, endpoint){
    let id = "dropBoxNoId";//change folderpermissionsid to this
    if(file.shared_folder_id){
        id = file.shared_folder_id;
    }
    let name = file.name;
    let permissions = [];
    let permissionIds = [];
    let owner = parent.owner;
    let permissionsMap = new Map();
    //creating permissions map
    for(let i = 0; i < permissions.length; i++){
        permissionsMap.set(permissionIds[i], permissions[i]);
    }
    let sharedFolderId = "";
    if(file[".tag"] !== "folder"){
        sharedFolderId = parent.id;
    }else{
        sharedFolderId = file.shared_folder_id;
    }
    console.log("sharing");
    console.log(sharedFolderId);
    let dropboxPermissions = undefined;
    if(sharedFolderId !== "root"){
        dropboxPermissions = (await endpoint
            .sharingListFolderMembers({"shared_folder_id": sharedFolderId}));//use this to find group and user permissions
    }
    if(dropboxPermissions){
        for(let user of dropboxPermissions.result.users){
            let type = 'user';//TODO WHEN IS IT A GROUP/DOMAIN
            let entity = user.user.email;
            let role = '';
            if(user.access_type[".tag"] === owner){
                owner = user.user.email;
            }
            if(user.access_type[".tag"] === owner || user.access_type[".tag"] === 'editor'){
                role = 'write';
            }else{
                role = 'read';
            }
            let isInherited = user.is_inherited;
            if(file[".tag"] !== "folder"){
                isInherited = true;
            }
            let p = new Permission(type, entity, role, isInherited);
            permissions.push(p);
            permissionIds.push(file.shared_folder_id);
        }
    }
    let createdTime = 'N/A';
    if(file.client_modified){
        createdTime = file.client_modified;
    }
    return new File(id, name, permissions, permissionIds, 'dropbox', owner, file.path_display, createdTime);
}

//TODO: permissions, owner
