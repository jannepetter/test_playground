import { refreshedAccessToken } from "@/api/users";
import axios from "axios";

export const getServerUrl = () => {
  switch (process.env.NEXT_PUBLIC_APP_ENV) {
    case "CI":
      return "http://server:8000";

    case "ENV":
      return "";

    default:
      return "http://localhost:8000";
  }
};

const createClient = () => {
  const headers = {
    "Content-Type": "application/json",
  };

  const instance = axios.create({
    baseURL: getServerUrl(),
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
