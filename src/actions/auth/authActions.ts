import { AuthResponse, UserInfo } from "../../types/authTypes";
import { User } from "../../types/userTypes";

const ACCESS_TOKEN = "access-token";
const REFRESH_TOKEN = "refresh-token";

const saveLocalStorage = (key?: string, value?: string) => {
	key && value && localStorage.setItem(key, value);
};

const login = async (
	email: string,
	password: string
): Promise<AuthResponse> => {
	const requestOptions: RequestInit = {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	};

	const response = await fetch("/api/auth/login", requestOptions);
	const data: AuthResponse = await response.json();
	saveLocalStorage(ACCESS_TOKEN, data.accessToken);
	saveLocalStorage(REFRESH_TOKEN, data.refreshToken);

	return data;
};

const register = async (
	username: string,
	email: string,
	password: string
): Promise<AuthResponse> => {
	const requestOptions: RequestInit = {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, email, password }),
	};

	const response = await fetch("/api/auth/register", requestOptions);
	const data: AuthResponse = await response.json();
	saveLocalStorage(ACCESS_TOKEN, data.accessToken);
	saveLocalStorage(REFRESH_TOKEN, data.refreshToken);

	return data;
};

const refreshToken = async (): Promise<boolean> => {
	const token = localStorage.getItem("refresh-token");
	if (token === null) return false;

	const requestOptions: RequestInit = {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ refreshToken: token }),
	};
	const response = await fetch("/api/auth/refresh", requestOptions);
	const {
		error,
		accessToken,
	}: {
		error?: string;
		accessToken?: string;
	} = await response.json();
	saveLocalStorage("access-token", accessToken);
	return error === undefined;
};

const getUserDetails = async (): Promise<UserInfo | null> => {
	try {
		const token = localStorage.getItem("access-token");
		if (token) {
			const data = JSON.parse(atob(token.split(".")[1])) as UserInfo;
			const requestOptions: RequestInit = {
				method: "GET",
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
			};

			const response = await fetch("/api/user/friends", requestOptions);
			const friendsData: { result: User[] } = await response.json();

			return {
				_id: data._id,
				email: data.email,
				username: data.username,
				friends: friendsData.result,
			};
		}
		return null;
	} catch {
		return null;
	}
};

const logout = async (): Promise<void> => {
	const token = localStorage.getItem("access-token");

	const requestOptions: RequestInit = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	await fetch("/api/auth/logout", requestOptions);
	localStorage.removeItem("access-token");
	localStorage.removeItem("refresh-token");
};

const googleAuth = async (id: string): Promise<AuthResponse> => {
	const requestOptions: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ token: id }),
	};

	const response = await fetch("/api/auth/googleAuth", requestOptions);
	const data: AuthResponse = await response.json();
	saveLocalStorage(ACCESS_TOKEN, data.accessToken);
	saveLocalStorage(REFRESH_TOKEN, data.refreshToken);

	return data;
};

export { login, register, getUserDetails, refreshToken, logout, googleAuth };
