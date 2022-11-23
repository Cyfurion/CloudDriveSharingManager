export class CloudServiceAdapter {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    permissionTypes = {};

    writable = [];

    deploy() {
        throw new Error("deploy() must be implemented.");
    }

    takeGroupSnapshot(){
        throw new Error("takeGroupSnapshot() must be implemented.");
    }

    takeSnapshot() {
        throw new Error("takeSnapshot() must be implemented.");
    }

    getProfile() {
        throw new Error("getProfile() must be implemented.");
    }
}
