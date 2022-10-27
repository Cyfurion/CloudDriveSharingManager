import { CloudServiceAdapter } from './CloudServiceAdapter';
import { File, Folder } from '../classes/file-class';
import { Permission } from '../classes/permission-class';
import FileSnapshot from '../classes/filesnapshot-class';

export class GoogleCloudServiceAdapter extends CloudServiceAdapter {
    deploy() {
        //TODO not implemented
    }

    // Returns an array of every file accessible to the user.
    async retrieve() {
        function requestExecute(pageToken, endpoint) {
            return new Promise((resolve, reject) => {
                let request = endpoint.client.request({
                    'method': 'GET',
                    'path': '/drive/v3/files',
                    'params': {
                        'fields': 'files(id,name,createdTime,owners,permissions,parents,owners,driveId),nextPageToken',
                        'pageSize': 1000,
                        'pageToken': pageToken
                    }
                });
                request.execute(function(res) { resolve(res); });
            });
        }

        let files = [];
        let token = "";
        do {
            let response = await requestExecute(token, this.endpoint);
            files = files.concat(response.files);
            token = response.nextPageToken;
        } while (token);
        await this.makeSnapshot(files);
        return files;
    }

    /**
     * Takes in a list of Google API files and creates a snapshot tree from it.
     * @param files 
     * @returns snapshot tree
     */
    makeSnapshot(files) {
        let parentToChildMap = new Map();
        // making map of key = parent and value = list of children
        for (let i = 0; i < files.length; i++) {
            // change this when adding to file schema
            let currentFile = createFileObject(files[i]);
            if (files[i].parents === undefined) {
                files[i].parents = [""];
            }
            for (let j=0; j<files[i].parents.length; j++) {
                if (!parentToChildMap.has(files[i].parents[j])) {
                    parentToChildMap.set(files[i].parents[j], [currentFile]);
                } else {
                    parentToChildMap.get(files[i].parents[j]).push(currentFile);
                }   
            }   
        }
        let rootFile = new File("root", "root", [], "root", "system", "/root", "N/A");
        let root = new Folder(rootFile, []);
        root.id = "";
        snapshotHelper(parentToChildMap, root);
        console.log(root);
        return new FileSnapshot(
            [this.endpoint.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail(), "Google Drive"], 
            root, 
            (new Date()).toString()
        );
    }
}

/**
 * Helper method to recursively make snapshot tree.
 * @param parentToChildMap Map to get subfiles
 * @param folder Folder that CDSM is currently populating
 */
function snapshotHelper(parentToChildMap, folder) {//add paths to files
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
function createFileObject(file){
    let id = file.id;
    let name = file.name;
    let permissions = [];
    if(file.permissions != undefined){
        for(let i = 0; i < file.permissions.length; i++){
            let permission = file.permissions[i];
            permissions.push(new Permission(permission.id, permission.type, permission.emailAddress, permission.role));
        }
    }
    let drive = "";
    if(file.driveId !== undefined){
        drive = file.driveId;
    }
    let owner = file.owners[0].emailAddress;
    let createdTime = file.createdTime;
    return new File(id, name, permissions, drive, owner, "", createdTime);
}

