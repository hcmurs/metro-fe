import type { ApiResponse } from "../types/api.type";
import type { User, UserRegister } from "../types/user.type";
import api from "./api";

export const apiFindUser = async (): Promise<ApiResponse<User> | null> => {
	try {
		const res = await api.get(`/users/me`);
		return res.data as ApiResponse<User>;
	} catch {
		return null;
	}
};

export const apiCheckUsernameExist = async (username: string): Promise<ApiResponse<boolean> | null> => {
	try {
		const res = await api.get(`/users/is-username-exist?username=${username}`);
		return res.data as ApiResponse<boolean>;
	} catch {
		return null;
	}
}

export const apiCheckEmailExist = async (email: string): Promise<ApiResponse<boolean> | null> => {
	try {
		const res = await api.get(`/users/is-email-exist?email=${email}`);
		return res.data as ApiResponse<boolean>;
	} catch {
		return null;
	}
}

export const registerUser = async (userRegister: UserRegister): Promise<ApiResponse<User> | null> => {
	try {
		const res = await api.post(`/users/register`, userRegister);
		return res.data as ApiResponse<User>;
	} catch {
		return null;
	}
}