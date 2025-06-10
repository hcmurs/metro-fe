import type { ApiResponse } from "../types/api.type";
import type { User } from "../types/user.type";
import api from "./api";

export const getUser = async (): Promise<ApiResponse<User> | null> => {
	try {
		const res = await api.get(`/users/me`);
		return res.data as ApiResponse<User>;
	} catch {
		return null;
	}
};