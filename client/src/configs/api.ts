import axios from 'axios';

const envBaseUrl = import.meta.env.VITE_BASE_URL?.trim().replace(/^['"]|['"]$/g, '').replace(/\/+$/, '');
const baseURL = envBaseUrl || (import.meta.env.PROD ? 'https://thumblify-server-kappa.vercel.app' : 'http://localhost:3000');

const api = axios.create({
    baseURL,
    withCredentials: true,
});

export default api;
