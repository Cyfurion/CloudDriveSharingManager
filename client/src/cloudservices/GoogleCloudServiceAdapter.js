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
                        'fields': 'files(name),nextPageToken',
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