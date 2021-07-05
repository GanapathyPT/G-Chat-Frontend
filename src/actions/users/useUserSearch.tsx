import { useContext, useState, MouseEvent } from "react";
import { SearchProps, SearchResultData } from "semantic-ui-react";
import { Room } from "../../types/userTypes";
import { AuthContext } from "../auth/AuthContext";
import { addFriend, getUser } from "./usersActions";

export interface SearchResult {
	id: string;
	title: string;
	description?: string;
}

export const useUserSearch = (
	rooms: Room[],
	addNewRoom: (newRoom: Room) => void
) => {
	const { authInfo } = useContext(AuthContext);
	const [searchText, setSearchText] = useState<string>("");
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [searchResult, setSearchResult] = useState<SearchResult[]>([]);

	const searchUser = async (query: string) => {
		const { userInfo } = authInfo;

		const users = await getUser(query);
		return users
			.filter((user) => user.id !== userInfo.id)
			.map((user) => ({
				id: user.id,
				title: user.username,
				description: user.email,
			}));
	};

	const onSearchChange = async (
		e: MouseEvent<HTMLElement>,
		data: SearchProps
	) => {
		if (data.value) {
			setSearchText(data.value);
			setSearchLoading(true);
			const users = await searchUser(data.value);
			setSearchResult(users);
			setSearchLoading(false);
		} else setSearchText("");
	};

	const onResultSelect = async (
		event: MouseEvent<HTMLDivElement>,
		data: SearchResultData
	) => {
		const room = rooms.find((room) => room.id === data.result.id);
		if (room === undefined) {
			const room = await addFriend(data.result.id);
			addNewRoom(room);
		}
		setSearchText("");
	};

	return {
		searchText,
		searchLoading,
		searchResult,
		onSearchChange,
		onResultSelect,
	};
};
