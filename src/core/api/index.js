import axios from "axios";

const BASE_URL = 'https://randomuser.me/api/1.3';
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    seed: '91cb2b09e6738870'
  }
});

export default api;