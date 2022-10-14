import { CloudServiceAdapter } from "./CloudServiceAdapter";

export class DropboxCloudServiceAdapter extends CloudServiceAdapter {
    deploy() {
        //TODO not implemented
    }

    // Returns an array of every file accessible to the user.
    async retrieve() {
        let response = await this.endpoint.filesListFolder({ 
            path: '',
            recursive: true
        });
        return response.result.entries;
    }
}
