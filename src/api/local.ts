import axios from 'axios';

export default axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL
})