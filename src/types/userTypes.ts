interface User {
	_id: string;
	email: string;
	username: string;
	roomId?: string;
}

interface SearchResult {
	_id: string;
	title: string;
	description: string;
}

interface Message {
	_id?: string;
	author: string;
	message: string;
	timestamp: Date;
}

export type { User, SearchResult, Message };
