import axios from "axios";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const createClient = () => {
  const headers = {
    "Content-Type": "application/json",
  };

  const instance = axios.create({
    baseURL: SERVER_URL,
    timeout: 60000,
    headers: headers,
  });

  return instance;
};

const apiClient = createClient();

export default apiClient;
