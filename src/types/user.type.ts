export interface User {
	userId: number;
	name: string;
	username: string;
	email: string;
	role: string;
	authProvider: string;
	pictureUrl: string;
	isStudent: boolean;
	studentExpiredDate: string;
	createdAt: string;
	updatedAt: string;
}

export interface UserRegister {
	name: string;
	username: string;
	email: string;
	password: string;
}

export interface StudentRequest {
	requestId: number;
	userId: number;
  title: string;
  content: string;
	citizenIdNumber: string;
  endDate: string;
  createdAt: string;
  requestStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  citizenIdentityCardImage: string;
  studentCardImage: string;
}

export interface StudentRequestCreation {
	content: string;
	citizenIdNumber: string;
	studentCardImage: string;
	citizenIdentityCardImage: string;
	endDate: string;
}

export interface Feedback {
	feedbackId: number;
  category: string;
	content: string;
	image?: string;
	reply?: string;
	userId: number;
	createdAt: string;
}

export interface FeedbackCreation {
	category: string;
	content: string;
	image: string;
}

export interface FeedbackReply {
	feedbackId: number;
	content: string;
}