import axios from 'axios';

axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api'
});

const addSnapshot = (payload) => api.post(`/db`, payload);
const getUser = (profile) => api.get(`/db/${profile}`);
const getSnapshot = (id) => api.get(`/db/${id}`);

const apis = {
    addSnapshot,
    getUser,
    getSnapshot
}

export default apis;
