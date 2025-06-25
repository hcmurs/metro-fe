export interface User {
	id: number;
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
	authProvider: string;
}