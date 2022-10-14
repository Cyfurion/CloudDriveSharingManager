import { CloudServiceAdapter } from "./CloudServiceAdapter";

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
        return files;
    }
}
