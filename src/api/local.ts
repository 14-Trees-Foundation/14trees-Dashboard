import axios from 'axios';
import { resolveApiBaseUrl } from './apiBaseUrl';

export default axios.create({
	baseURL: resolveApiBaseUrl(import.meta.env.VITE_APP_BASE_URL),
});
