import { Folder } from "../classes/file-class";
import { CloudServiceAdapter } from "./CloudServiceAdapter";
import { FolderMetadata } from "dropbox";
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

        let root = new Folder("root", "root", "root", []);
        await makeSnapshot(root, '', this.endpoint);
        console.log(root);
        return files;
    }
}

async function makeSnapshot(folder, path, endpoint){
    console.log("path: ", path);
    let response = await endpoint.filesListFolder({ 
        path: path
    });
    for (let element of response.result.entries) {
        if(element[".tag"] === "folder"){
            let newFolder = new Folder(["dropBoxNoId"], element.name, [], []);
            await makeSnapshot(newFolder, path + "/" + element.name, endpoint);
            folder.files.push(newFolder);
        }else{
            let newFile = new File(["dropBoxNoId"], element.name, []);
            folder.files.push(newFile);
        }
    }
}
