import { MouseEvent, useContext, useEffect, useState } from "react";
import { Redirect } from "react-router";
import { SearchProps, SearchResultData } from "semantic-ui-react";
import { AuthContext } from "../actions/auth/AuthContext";
import { addFriend, getUser } from "../actions/users/usersActions";
import { Home } from "../components/Home";
import { ActionTypes, AuthStatus } from "../types/authTypes";
import { MessageType, SearchResult, User } from "../types/userTypes";

function HomeContainer() {
	const { authInfo, dispatch } = useContext(AuthContext);
	const [value, setValue] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [results, setResults] = useState<SearchResult[]>([]);
	const [activeUser, setActiveUser] = useState<User | null>(null);
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [messagesLoading, setMessagesLoading] = useState<boolean>(false);

	useEffect(() => {
		const socket = authInfo.socket;
		if (socket !== null) {
			socket.on(
				"oldMessages",
				({ messages }: { messages: MessageType[] }) => {
					setMessages(messages);
					setMessagesLoading(false);
				}
			);
			socket.on(
				"newMessage",
				({ newMessage }: { newMessage: MessageType }) => {
					setMessages((oldMessages) => [...oldMessages, newMessage]);
				}
			);
			socket.on("alert", (data: any) => alert(data));
		}
	}, [authInfo.socket]);

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
		const oldFriends = authInfo.userInfo.friends;
		if (oldFriends) {
			const friend = oldFriends.find((friend) => friend._id === id);
			if (friend) {
				setMessages([]);
				setMessagesLoading(true);
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
				userOnClick(friend._id);
			} else userOnClick(friend._id);
		}
		setValue("");
	};

	const logoutUser = async () => {
		dispatch({
			type: ActionTypes.LOGOUT,
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
		setMessages([]);
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
			messagesLoading={messagesLoading}
		/>
	);
}

export { HomeContainer };
