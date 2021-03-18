import { MouseEvent, useContext, useEffect, useState } from "react";
import { Redirect } from "react-router";
import { SearchProps, SearchResultData } from "semantic-ui-react";
import { AuthContext } from "../actions/auth/AuthContext";
import { addFriend, getUser } from "../actions/users/usersActions";
import { logout } from "../actions/auth/authActions";
import { Home } from "../components/Home";
import { ActionTypes, AuthStatus, UserInfo } from "../types/authTypes";
import { Message, SearchResult, User } from "../types/userTypes";

function HomeContainer() {
	const { authInfo, dispatch } = useContext(AuthContext);
	const [value, setValue] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [results, setResults] = useState<SearchResult[]>([]);
	const [activeUser, setActiveUser] = useState<User | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		const socket = authInfo.socket;
		if (socket !== null) {
			socket.on(
				"oldMessages",
				({ messages }: { messages: Message[] }) => {
					setMessages(messages);
				}
			);
			socket.on(
				"newMessage",
				({ newMessage }: { newMessage: Message }) => {
					setMessages((oldMessages) => [...oldMessages, newMessage]);
				}
			);
			socket.on("alert", (data: any) => alert(data));
		}
	}, [authInfo.socket]);

	useEffect(() => {
		if (authInfo.socket && authInfo.userInfo.friends)
			authInfo.socket.emit(
				"joinAllRoom",
				authInfo.userInfo.friends.map((friend) => friend.roomId)
			);
	}, [authInfo.userInfo.friends, authInfo.socket]);

	const searchUser = async (query: string) => {
		const { userInfo } = authInfo;

		const users = await getUser(query);
		return users
			.filter((user) => user._id !== userInfo._id)
			.map((user) => ({
				_id: user._id,
				title: user.username,
				description: user.email,
			}));
	};

	const onSearchChange = async (
		e: MouseEvent<HTMLElement>,
		data: SearchProps
	) => {
		if (data.value) {
			setValue(data.value);
			setLoading(true);
			const users = await searchUser(data.value);
			setResults(users);
			setLoading(false);
		} else setValue("");
	};

	const userOnClick = async (id: string) => {
		// TODO: fetch last messages of the selected user
		const oldFriends = authInfo.userInfo.friends;
		if (oldFriends) {
			const friend = oldFriends.find((friend) => friend._id === id);
			if (friend) {
				authInfo.socket?.emit("getMessages", {
					roomId: friend.roomId,
				});
				setActiveUser(friend);
			}
		}
	};

	const onResultSelect = async (
		event: MouseEvent<HTMLDivElement>,
		data: SearchResultData
	) => {
		const oldFriends = authInfo.userInfo.friends;
		if (oldFriends) {
			const friend = oldFriends.find(
				(friend) => friend._id === data.result._id
			);
			if (friend === undefined) {
				const friend = await addFriend(data.result._id);

				dispatch({
					type: ActionTypes.UPDATE_USERINFO,
					payload: {
						friends: [...oldFriends, friend],
					},
				});
				setActiveUser(friend);
			} else setActiveUser(friend);
		}
		setValue("");
	};

	const logoutUser = async () => {
		await logout();
		dispatch({
			type: ActionTypes.AUTHENTICATE,
			payload: {
				loading: true,
			},
		});
	};

	const sendMessage = (message: string) => {
		if (message.trim().length !== 0) {
			authInfo.socket?.emit("sendMessage", {
				roomId: activeUser?.roomId,
				author: authInfo.userInfo._id,
				message,
			});
		}
	};

	const deSelectUser = () => {
		setActiveUser(null);
	};

	if (authInfo.authStatus !== AuthStatus.AUTHENTICATED)
		return <Redirect to="/login" />;

	return (
		<Home
			loading={loading}
			onResultSelect={onResultSelect}
			onSearchChange={onSearchChange}
			results={results}
			value={value}
			activeUser={activeUser}
			messages={messages}
			userOnClick={userOnClick}
			logoutUser={logoutUser}
			sendMessage={sendMessage}
			deSelectUser={deSelectUser}
		/>
	);
}

export { HomeContainer };
