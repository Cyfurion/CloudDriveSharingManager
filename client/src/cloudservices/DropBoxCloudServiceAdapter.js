import { CloudServiceAdapter } from "./CloudServiceAdapter";

export class DropboxCloudServiceAdapter extends CloudServiceAdapter {
    deploy() {
        //TODO not implemented
    }

    // Returns an array of every file accessible to the user.
    retrieve() {
        this.endpoint.filesListFolder({ path: '' }).then(function(response) {
            return response.result.entries;
        });
    }
}
