export class CloudServiceAdapter {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    deploy() {
        throw new Error("deploy() must be implemented.");
    }

    takeSnapshot() {
        throw new Error("takeSnapshot() must be implemented.");
    }

    getProfile() {
        throw new Error("getProfile() must be implemented.");
    }
}
