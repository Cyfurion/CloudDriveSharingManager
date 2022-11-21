import axios from 'axios';
import AccessControlRequirement from '../classes/accesscontrolrequirement-class';
import FileSnapshot from '../classes/filesnapshot-class';

axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api'
});

const addACR = (payload) => api.post(`/acrs`, payload);
const addSnapshot = (payload) => api.post(`/snapshots`, payload);
const deleteACR = (index, profile) => api.patch(`/acrs/${index}`, profile);
const getUser = async (profile) => {
    let user = (await api.get(`/users/${profile}`)).data;
    user.fileSnapshotIDs = new Map([...(new Map(Object.entries(user.fileSnapshotIDs))).entries()].sort().reverse());
    for (let i = 0; i < user.acrs.length; i++) {
        user.acrs[i] = Object.assign(new AccessControlRequirement(), JSON.parse(user.acrs[i]));
    }
    return user;
}
const getSnapshot = async (id) => (new FileSnapshot()).deserialize((await api.get(`/snapshots/${id}`)).data.contents);

const apis = {
    addACR,
    addSnapshot,
    deleteACR,
    getUser,
    getSnapshot
}

export default apis;
