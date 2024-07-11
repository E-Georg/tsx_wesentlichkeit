import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const API = 'http://192.168.20.53/wa/api/';
const token = getAuthToken();
// Erstelle eine Axios-Instanz
export const axiosInstance = axios.create({
  baseURL: API, // Ersetze dies durch deine Basis-URL
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});
