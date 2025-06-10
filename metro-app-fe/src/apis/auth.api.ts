import api from "./api";

export const logoutUser = async (): Promise<void | null> => {
  try {
    await api.post("http://localhost:4003/api/auth/logout");
  } catch {
    return null;
  }
};