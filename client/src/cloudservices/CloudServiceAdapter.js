export class CloudServiceAdapter{
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    deploy() {
        throw new Error("deploy() must be implemented.");
    }
    
    retrieve() {
        throw new Error("retrieve() must be implemented.");
    }
}
