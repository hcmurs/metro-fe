export interface User {
	id: number;
	name: string;
	email: string;
	role: string;
	authProvider: string;
	pictureUrl: string;
	isStudent: boolean;
  studentExpiredDate: string;
	createdAt: string;
	updatedAt: string;
}