import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:1000',  // <-- Cambiado a tu puerto local de backend
  withCredentials: true,  // ✅ IMPORTANTE: Para que las cookies CSRF funcionen
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;