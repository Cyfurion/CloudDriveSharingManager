export class CloudServiceAdapter {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    permissionTypes = {};

    writable = [];

    deploy() {
        throw new Error("deploy() must be implemented.");
    }

    deployValidate() {
        throw new Error("deployValidate() must be implemented.");
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
