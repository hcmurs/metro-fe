import type { ApiResponse } from "../types/api.type";
import type { Feedback, FeedbackCreation, FeedbackReply, StudentRequest, StudentRequestCreation, User, UserRegister } from "../types/user.type";
import api from "./api";

//User
export const apiFindUser = async (): Promise<ApiResponse<User> | null> => {
	try {
		const res = await api.get(`/users/me`);
		return res.data as ApiResponse<User>;
	} catch {
		return null;
	}
};

export const apiFindUserById = async (userId: number): Promise<ApiResponse<User> | null> => {
	try {
		const res = await api.get(`/users/${userId}`);
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

//Request
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

export const apiFindAllRequests = async (): Promise<ApiResponse<StudentRequest[]> | null> => {
	try {
		const res = await api.get(`/users/requests`);
		return res.data as ApiResponse<StudentRequest[]>;
	} catch {
		return null;
	}
}

export const apiVerifyRequest = async (requestId: number, isApproved: boolean, rejectionReason?: string): Promise<ApiResponse<void> | null> => {
	try {
		const res = await api.post(`/users/requests/verify?requestId=${requestId}&isApproved=${isApproved}&rejectionReason=${rejectionReason}`);
		return res.data as ApiResponse<void>;
	} catch {
		return null;
	}
}

//Feedback
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

export const apiFindAllFeedbacks = async (): Promise<ApiResponse<Feedback[]> | null> => {
	try {
		const res = await api.get(`/users/feedbacks`);
		return res.data as ApiResponse<Feedback[]>;
	} catch {
		return null;
	}
}

export const apiReplyFeedback = async (request: FeedbackReply): Promise<ApiResponse<Feedback> | null> => {
	try {
		const res = await api.post('/users/feedbacks/reply', request);
		return res.data as ApiResponse<Feedback>;
	} catch {
		return null;
	}
}