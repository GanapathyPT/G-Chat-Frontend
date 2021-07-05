import { Room, User } from "../../types/userTypes";
import { getRequestInstance } from "../config";

export const getUser = async (query: string): Promise<User[]> => {
	const response = await getRequestInstance().get<{ result: User[] }>(
		"user/get-user?" +
			new URLSearchParams({
				q: query,
			})
	);
	const result = response.data.result;
	return result;
};

export const addFriend = async (id: string): Promise<Room> => {
	const response = await getRequestInstance().post<{ result: Room }>(
		"user/create-room",
		{ newFriend: id }
	);
	const result = response.data.result;
	return result;
};

export const getRooms = async (): Promise<any[]> => {
	const response = await getRequestInstance().get<{ result: any[] }>(
		"user/rooms"
	);
	const rooms = response.data.result;
	return rooms;
};
