import axios from 'axios';
let instance = axios.create({
  baseURL: 'http://192.168.1.3:8000',
});
export default instance;
