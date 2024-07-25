import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;