export class CloudServiceAdapter{
    endpoint;
    constructor(endpoint){
        this.endpoint = endpoint;
    }
    deploy(){
        throw new Error("Must be implemented.");
    }
    retrieveSnapshot(){
        throw new Error("Must be implemented.");
    }
}
