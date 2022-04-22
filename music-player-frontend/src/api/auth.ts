import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.0.16:5000",
  timeout: 5000,
});

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const loginRequest = async (
  email: string,
  password: string
): Promise<User> => {
  const data = await api.post<User>("/auth/login", { email, password });
  return data.data;
};

export const signupRequest = async (
  email: string,
  username: string,
  password: string
): Promise<User> => {
  const data = await api.post("/auth/signup", { email, username, password });
  return data.data;
};
