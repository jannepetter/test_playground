import { refreshedAccessToken } from "@/api/users";
import axios from "axios";

const createClient = () => {
  const headers = {
    "Content-Type": "application/json",
  };

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    timeout: 60000,
    headers: headers,
  });

  return instance;
};

const apiClient = createClient();

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access");
  if (accessToken) {
    config.headers.Authorization = "Bearer " + accessToken;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.detail === "Given token not valid for any token type"
    ) {
      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        const response = await refreshedAccessToken(refreshToken);
        if (response.status === 200 && response?.data?.access) {
          const accessToken = response.data.access;
          window.localStorage.setItem("access", accessToken);
          error.config.headers.Authorization = "Bearer " + accessToken;
          return apiClient(error.config);
        }
        // refreshtoken expired
        localStorage.clear();
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
