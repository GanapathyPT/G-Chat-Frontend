import axios from "axios";
import { ACCESS_TOKEN } from "./auth/authActions";

export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL as string;
export const BASE_URL = process.env.REACT_APP_BACKEND_URL as string;
export const getRequestInstance = () => {
	const token = localStorage.getItem(ACCESS_TOKEN);
	return axios.create({
		baseURL: BASE_URL,
		timeout: 1000,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};
