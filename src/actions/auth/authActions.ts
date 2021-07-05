import axios from "axios";
import { AuthResponse, UserInfo } from "../../types/authTypes";
import { BASE_URL, getRequestInstance } from "../config";

export const ACCESS_TOKEN = "access-token";
export const REFRESH_TOKEN = "refresh-token";

const setValuesLocal = (key?: string, value?: string) => {
	key && value && localStorage.setItem(key, value);
};

const login = async (
	email: string,
	password: string
): Promise<AuthResponse> => {
	const data = await (
		await axios.post<AuthResponse>(BASE_URL + "/auth/login", {
			email,
			password,
		})
	).data;
	setValuesLocal(ACCESS_TOKEN, data.accessToken);
	setValuesLocal(REFRESH_TOKEN, data.refreshToken);

	return data;
};

const register = async (
	username: string,
	email: string,
	password: string
): Promise<AuthResponse> => {
	const data = await (
		await axios.post<AuthResponse>(BASE_URL + "/auth/register", {
			username,
			email,
			password,
		})
	).data;
	setValuesLocal(ACCESS_TOKEN, data.accessToken);
	setValuesLocal(REFRESH_TOKEN, data.refreshToken);

	return data;
};

const refreshToken = async (): Promise<boolean> => {
	const token = localStorage.getItem("refresh-token");
	if (token === null) return false;
	const response = await getRequestInstance().post<{
		error?: string;
		accessToken?: string;
	}>("/auth/refresh", { refreshToken: token });

	const { error, accessToken } = response.data;
	setValuesLocal(ACCESS_TOKEN, accessToken);
	return error === undefined;
};

const getUserDetails = async (): Promise<UserInfo | null> => {
	try {
		const token = localStorage.getItem("access-token");
		if (token) {
			const { id, email, username } = JSON.parse(
				atob(token.split(".")[1])
			) as UserInfo;
			return {
				id,
				email,
				username,
			};
		}
		return null;
	} catch {
		return null;
	}
};

const logout = async (): Promise<void> => {
	await getRequestInstance().get("/auth/logout");
	localStorage.removeItem(ACCESS_TOKEN);
	localStorage.removeItem(REFRESH_TOKEN);
};

const googleAuth = async (id: string): Promise<AuthResponse> => {
	const response = await getRequestInstance().post<AuthResponse>(
		"/auth/googleAuth",
		{ token: id }
	);
	const data: AuthResponse = response.data;
	setValuesLocal(ACCESS_TOKEN, data.accessToken);
	setValuesLocal(REFRESH_TOKEN, data.refreshToken);
	return data;
};

export { login, register, getUserDetails, refreshToken, logout, googleAuth };
