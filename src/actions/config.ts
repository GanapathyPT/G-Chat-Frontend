export const BASE_URL =
	process.env.NODE_ENV === "development"
		? "/api"
		: "https://g-chat-messenger.herokuapp.com/api";
