import type { ApiResponse } from "../types/api.type";
import type { Feedback, FeedbackCreation, StudentRequest, StudentRequestCreation, User, UserRegister } from "../types/user.type";
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

export const apiFindRequestByUserId = async (userId: number): Promise<ApiResponse<StudentRequest[]> | null> => {
	try {
		const res = await api.get(`/users/requests/${userId}`);
		return res.data as ApiResponse<StudentRequest[]>;
	} catch {
		return null;
	}
}

export const apiCreateRequest = async (request: StudentRequestCreation): Promise<ApiResponse<StudentRequest> | null> => {
	try {
		const res = await api.post(`/users/requests`, request);
		return res.data as ApiResponse<StudentRequest>;
	} catch {
		return null;
	}
}

export const apiFindFeedbackByUserId = async (userId: number): Promise<ApiResponse<Feedback[]> | null> => {
	try {
		const res = await api.get(`/users/feedbacks/${userId}`);
		return res.data as ApiResponse<Feedback[]>;
	} catch {
		return null;
	}
}

export const apiCreateFeedback = async (request: FeedbackCreation): Promise<ApiResponse<Feedback> | null> => {
	try {
		const res = await api.post(`/users/feedbacks`, request);
		return res.data as ApiResponse<Feedback>;
	} catch {
		return null;
	}
}