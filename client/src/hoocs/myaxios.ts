import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:3030/',
})

instance.interceptors.request.use((config) => {
    const accessToken = window.localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
})

export default instance;