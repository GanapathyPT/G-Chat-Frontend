import { User } from "../../types/userTypes";
import { BASE_URL } from "../config";

const getUserList = async (): Promise<User[]> => {
	const accessToken = localStorage.getItem("access-token");

	const requestOptions: RequestInit = {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	};
	const response = await fetch(BASE_URL + "/user/list", requestOptions);
	const data: User[] = await response.json();
	return data;
};

const getUser = async (query: string): Promise<User[]> => {
	const accessToken = localStorage.getItem("access-token");

	const requestOptions: RequestInit = {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	};
	const response = await fetch(
		BASE_URL +
			"/user/get-user?" +
			new URLSearchParams({
				q: query,
			}),
		requestOptions
	);
	const data: { result: User[] } = await response.json();
	return data.result;
};

const addFriend = async (id: string): Promise<User> => {
	const accessToken = localStorage.getItem("access-token");

	const requestOptions: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ newFriend: id }),
	};
	const response = await fetch(BASE_URL + "/user/add-friend", requestOptions);
	const data: { result: User } = await response.json();
	return data.result;
};

export { getUserList, getUser, addFriend };
