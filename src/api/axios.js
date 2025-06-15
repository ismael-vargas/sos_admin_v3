// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:9000',
  withCredentials: true // Importante para que envíe cookies
});

export default instance;
