import { CloudServiceAdapter } from './CloudServiceAdapter';
import { File, Folder } from '../classes/file-class';
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
                        'fields': 'files(id,name,parents,createdTime,owners,permissions),nextPageToken',
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
        console.log(this.makeSnapshot(files));
        return files;
    }

    makeSnapshot(files) {
        let parentToChildMap = new Map();
        let idToFileMap = new Map();
        // Making map of key = parent and value = list of children
        for (let file of files) {
            // TODO: change this when adding to file schema
            let currentFile = new File(file.id, file.name, file.permissions);
            idToFileMap.set(file.id, currentFile);
            if (file.parents === undefined) {
                file.parents = [""];
            }
            for (let parent of file.parents) {
                if (!parentToChildMap.has(parent)) {
                    parentToChildMap.set(parent, [currentFile]);
                } else {
                    parentToChildMap.get(parent).push(currentFile);
                }   
            }   
        }
        let root = new Folder("root", "root", "root", []);
        root.id = "";
        snapshotHelper(parentToChildMap, idToFileMap, root);
        return new FileSnapshot(
            [this.endpoint.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail(), "Google Drive"], 
            root, 
            (new Date()).toString()
        );
    }
}

function snapshotHelper(parentToChildMap, idToFileMap, folder) {
    let childrenList = parentToChildMap.get(folder.id);
    for (let i = 0; i < childrenList.length; i++) {
        if (parentToChildMap.has(childrenList[i].id)) {
            // childrenList[i] is folder
            let newFolder = new Folder(childrenList[i].id, childrenList[i].name, childrenList[i].permissions, []);
            childrenList[i] = newFolder;
            snapshotHelper(parentToChildMap, idToFileMap, newFolder);
        }
    }
    folder.files = childrenList;
}
