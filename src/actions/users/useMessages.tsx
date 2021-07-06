import { useEffect } from "react";
import { useContext } from "react";
import { useRef, useState } from "react";
import { connect, Socket } from "socket.io-client";
import { AuthStatus } from "../../types/authTypes";
import { Message, Room, User } from "../../types/userTypes";
import { ACCESS_TOKEN } from "../auth/authActions";
import { AuthContext } from "../auth/AuthContext";
import { SOCKET_URL } from "../config";
import { getRooms } from "./usersActions";

interface RoomsCache {
	rooms?: Room[];
}

enum SocketListenerTypes {
	NEW_MESSAGE = "NEW_MESSAGE",
	ALERT = "ALERT",
	USER_ONLINE = "USER_ONLINE",
	USER_OFFLINE = "USER_OFFLINE",
}

enum SocketEmitTypes {
	SEND_MESSAGE = "SEND_MESSAGE",
	DISCONNECT = "disconnect",
}

interface AlertType {
	type: string;
	msg: string;
}

let socket: undefined | typeof Socket;

const getSocket = () => {
	const token = localStorage.getItem(ACCESS_TOKEN);
	if (token === null) return;

	if (socket === undefined) {
		socket = connect(SOCKET_URL, {
			query: {
				token,
			},
		});
		return socket;
	}
	return socket;
};

export const useMessages = () => {
	const { authInfo } = useContext(AuthContext);
	const cache = useRef<RoomsCache>({});
	const [rooms, setRooms] = useState<Room[]>([]);
	const [activeRoom, setActiveRoom] = useState<string>();

	useEffect(() => {
		const fetchRooms = async () => {
			const allRooms = await getRooms();
			let allRoomsExtracted = allRooms.map((room) => ({ ...room }));
			allRooms.forEach((room, index) => {
				allRoomsExtracted[index].messages = allRoomsExtracted[
					index
				].messages.map((message: { author: string }) => ({
					...message,
					author: room.users.find(
						(user: User) => user.id === message.author
					),
				}));
			});

			setRooms(allRoomsExtracted as Room[]);
		};

		if (cache.current.rooms !== undefined) setRooms(cache.current.rooms);
		else fetchRooms();
	}, []);

	useEffect(() => {
		const changeUserActiveStatus = (userId: string, status: boolean) => {
			if (userId === authInfo.userInfo.id) return;
			setRooms((oldRooms) =>
				oldRooms.map((room) => ({
					...room,
					users: room.users.map((user) =>
						user.id === userId ? { ...user, online: status } : user
					),
				}))
			);
		};

		const addNewMessage = (roomId: string, newMessage: Message) => {
			setRooms((oldRooms) => {
				const oldRoomsCopy = oldRooms.map((room) => ({ ...room }));
				const roomIndex = oldRoomsCopy.findIndex(
					(room) => room.id === roomId
				);
				// removing the room from the list
				// add the message to the room
				// add it again on start of the list
				const currentRoom = JSON.parse(
					JSON.stringify(oldRoomsCopy[roomIndex])
				);
				currentRoom.messages.push(newMessage);
				oldRoomsCopy.splice(roomIndex, 1);
				oldRoomsCopy.unshift(currentRoom);
				return oldRoomsCopy;
			});
		};

		getSocket()?.on(
			SocketListenerTypes.NEW_MESSAGE,
			({ roomId, message }: { roomId: string; message: Message }) =>
				addNewMessage(roomId, message)
		);
		getSocket()?.on(SocketListenerTypes.ALERT, (data: AlertType) =>
			alert(data.msg)
		);
		getSocket()?.on(SocketListenerTypes.USER_ONLINE, (userId: string) =>
			changeUserActiveStatus(userId, true)
		);
		getSocket()?.on(SocketListenerTypes.USER_OFFLINE, (userId: string) =>
			changeUserActiveStatus(userId, false)
		);
	}, [authInfo]);

	useEffect(() => {
		if (authInfo.authStatus === AuthStatus.NOT_AUTHENTICATED) {
			setRooms([]);
			setActiveRoom(undefined);
			cache.current = {};
		}
	}, [authInfo.authStatus]);

	const selectRoom = (id: string) => {
		const room = rooms.find((room) => room.id === id);
		if (room) setActiveRoom(room.id);
	};

	const sendMessage = (message: string) => {
		if (activeRoom && message.trim().length !== 0) {
			getSocket()?.emit(SocketEmitTypes.SEND_MESSAGE, {
				roomId: activeRoom,
				message,
				createdAt: new Date(),
			});
		}
	};

	const deSelectUser = () => {
		setActiveRoom(undefined);
	};

	const addNewRoom = (newRoom: Room) => {
		if (!rooms.includes(newRoom))
			setRooms((oldRooms) => [...oldRooms, newRoom]);
		selectRoom(newRoom.id);
	};

	return {
		rooms,
		activeRoom,
		selectRoom,
		sendMessage,
		deSelectUser,
		addNewRoom,
	};
};
