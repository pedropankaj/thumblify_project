import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, '');
const baseURL = configuredBaseUrl || (import.meta.env.PROD ? '' : 'http://localhost:3000');

const api = axios.create({
    baseURL,
    withCredentials: true,
});

export default api;
