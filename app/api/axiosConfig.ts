import axios from 'axios';
import { Alert } from 'react-native';

const port = '3000';
const myIP = '192.168.11.177'; 
const baseURL = `http://${myIP}:${port}`;

// axios create
const api = axios.create({
  baseURL: baseURL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      Alert.alert(
        'Network Error',
        "Can't connect to the server. Please check your network connection or ensure the server is running."
      );
    }
    return Promise.reject(error);
  }
);

export default api;