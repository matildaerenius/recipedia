import axios from "axios";

const axiosPrivate = axios.create({
  baseURL: "http://localhost:8080",
});

axiosPrivate.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
  config.headers = config.headers || {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
},
(error) => Promise.reject(error)
);


axiosPrivate.interceptors.response.use(
(res) => res,
(error) => {
  const status = error?.response?.status;
  if (status === 401 || status === 403) {
    
    localStorage.removeItem("jwt");
    sessionStorage.removeItem("jwt");
    
  }
  return Promise.reject(error);
}
);

export default axiosPrivate;
