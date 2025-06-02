import type { User } from "../types/user.type";
import api from "./api";

export const getUser = async (): Promise<User | null> => {
  try {
    const res = await api.get(`/users/me2`);
    return res.data.data as User;
  } catch {
    return null;
  }
};