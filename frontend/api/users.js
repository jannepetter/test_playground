import apiClient from "@/utils/fetcher";

export const login = async (username, password) => {
  const data = await apiClient.post("/api/token/", { username, password });
  console.log("resp--", data);
  return data;
};
