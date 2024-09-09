import apiClient from "@/utils/fetcher";

export const login = async (username, password) => {
  const response = await apiClient.post("/api/token/", { username, password });
  return response;
};

export const refreshedAccessToken = async (refreshToken) => {
  const response = await apiClient.post("/api/token/refresh/", { refresh: refreshToken });
  return response;
};
