import { CloudServiceAdapter } from "./CloudServiceAdapter";

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
                        'fields': 'files(name,createdTime,owners),nextPageToken',
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
        return files;
    }
}

// function makeSnapshot(files){
//     let parentToChildMap = new Map();
//     let idToFileMap = new Map();
//     //making map of key = parent and value = list of children
//     for (let i=0; i<files.length; i++){
//         //change this when adding to file schema
//         let currentFile = new File(files[i].id, files[i].name, files[i].permissions);
//         idToFileMap.set(files[i].id, currentFile);
//         if(files[i].parents === undefined) {
//             files[i].parents = [""];
//         }
//         for(let j=0; j<files[i].parents.length; j++){
//             if(!parentToChildMap.has(files[i].parents[j])){
//                 parentToChildMap.set(files[i].parents[j], [currentFile]);
//             }else{
//                 parentToChildMap.get(files[i].parents[j]).push(currentFile);
//             }   
//         }   
//     }
//     let root = new Folder("root", "root", "root", []);
//     root.id = "";
//     snapshotHelper(parentToChildMap, idToFileMap, root);
// }

// function snapshotHelper(parentToChildMap, idToFileMap, folder){
//     let childrenList = parentToChildMap.get(folder.id);
//     for(let i=0; i<childrenList.length; i++){
//         if(parentToChildMap.has(childrenList[i].id)){
//             //childrenList[i] is folder
//             let newFolder = new Folder(childrenList[i].id, childrenList[i].name, childrenList[i].permissions, []);
//             childrenList[i] =  newFolder;
//             snapshotHelper(parentToChildMap, idToFileMap, newFolder);
//         }
//     }
//     folder.files = childrenList;
// }