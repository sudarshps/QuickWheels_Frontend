import axios, { AxiosRequestHeaders } from "axios";
import store from "../redux/store";

const api = axios.create({
    baseURL:`${import.meta.env.VITE_BACKEND_URL}/admin`
})

api.interceptors.request.use(
    (config) => {
      const { token } = store.getState().adminauth;
  
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }
  
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  

  export default api