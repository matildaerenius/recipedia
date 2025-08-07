import axios from "axios";

const axiosPrivate = axios.create({
  baseURL: "http://localhost:8080",
});

axiosPrivate.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosPrivate;
