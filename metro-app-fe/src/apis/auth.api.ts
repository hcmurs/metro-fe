import api from "./api";

export const logoutUser = async (): Promise<void | null> => {
  try {
    await api.post("http://localhost:8081/api/v1/auth/logout");
  } catch {
    return null;
  }
};