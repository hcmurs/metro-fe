import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import type { User } from "../types/user.type";
import api from "./api";

export const apiLogout = async (): Promise<void | null> => {
  try {
    await api.post(API_PATH.LOGOUT);
  } catch {
    return null;
  }
};

export const apiLocalLogin = async (username: string, password: string): Promise<ApiResponse<User> | null> => {
  try {
    const res = await api.post(API_PATH.LOCAL_LOGIN, { username, password });
    return res.data as ApiResponse<User>;
  } catch {
    return null;
  }
};