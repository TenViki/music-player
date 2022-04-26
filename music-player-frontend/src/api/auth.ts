import axios from "axios";
import { TokenManager } from "../utils/tokenmanager";

export const BACKEND_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 5000,
});

export interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
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

export const meRequest = async (): Promise<User> => {
  const data = await api.get<User>("/auth/me", {
    headers: {
      Authorization: TokenManager.token,
    },
  });
  return data.data;
};
