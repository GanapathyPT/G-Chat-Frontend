export interface User {
	id: string;
	email: string;
	username: string;
	online: boolean;
	profilePic?: string;
}

export interface Message {
	id: string;
	author: User;
	message: string;
	createdAt: string;
}

export interface Room {
	id: string;
	name: string;
	users: User[];
	messages: Message[];
}
