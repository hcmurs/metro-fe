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
	requestId: string;
  title: string;
  content: string;
  endDate: string;
  createdAt: string;
  requestStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  citizenIdentityCardImage: string;
  studentCardImage: string
}

export interface StudentRequestCreation {
	content: string;
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
	userId?: string;
	createdAt: string;
}

export interface FeedbackCreation {
	category: string;
	content: string;
	image: string;
}