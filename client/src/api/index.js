import axios from 'axios';

axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api'
});

const getUser = (id) => api.get(`/user/${id}`);
const getSnapshot = (id) => api.get(`snapshot/${id}`);

const apis = {
    getUser,
    getSnapshot
}

export default apis;
