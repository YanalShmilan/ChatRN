import axios from "axios";

let instance = axios.create({
  baseURL: "http://192.168.2.168:8000",
});

export default instance;
