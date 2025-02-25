import axios from 'axios';

console.log("Base URL:", process.env.REACT_APP_BASE_URL);

export default axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
})