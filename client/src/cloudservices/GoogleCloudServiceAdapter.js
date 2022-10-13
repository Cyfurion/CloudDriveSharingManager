import { CloudServiceAdapter } from "./CloudServiceAdapter";

export class GoogleCloudServiceAdapter extends CloudServiceAdapter{
    constructor(endpoint){
        super(endpoint);
        console.log(this.endpoint);
        console.log("endpoint print");
    }

    deploy(){
        //TODO not implemented
    }

    retrieveSnapshot(){
        let files = [];
        let endpoint = this.endpoint;
        let request = endpoint.client.request({
            'method': 'GET',
            'path': '/drive/v3/files',
            'params': {
                'pageSize': 1000
            }
        });
        request.execute(function(res) {
            files = res.files;
            files = files.concat(getNextPage(res.nextPageToken, endpoint));
            console.log("done");
            console.log(files);
            console.log(files.length);

        });
    }

    
}
function getNextPage(nextPageToken, endpoint){
    let files = [];
    let request = endpoint.client.request({
        'method': 'GET',
        'path': '/drive/v3/files',
        'params': {
            'pageSize': 1000,
            'pageToken': nextPageToken
        }
    });
    return request.execute(function(res) {
        files = res.files;
        if(res.files.length >= 1000){
            console.log("appending");
            res.files = res.files.concat(getNextPage(res.nextPageToken, endpoint));
        }     
        console.log(files.length);
        console.log(files);
        return files;
    });
}