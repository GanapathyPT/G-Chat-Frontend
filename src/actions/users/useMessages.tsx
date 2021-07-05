import { useEffect } from "react";
import { useRef, useState } from "react";
import { connect } from "socket.io-client";
import { Message, Room, User } from "../../types/userTypes";
import { ACCESS_TOKEN } from "../auth/authActions";
import { SOCKET_URL } from "../config";
import { getRooms } from "./usersActions";

interface RoomsCache {
	rooms?: Room[];
}

enum SocketListenerTypes {
	NEW_MESSAGE = "NEW_MESSAGE",
	ALERT = "ALERT",
}

enum SocketEmitTypes {
	SEND_MESSAGE = "SEND_MESSAGE",
	DISCONNECT = "disconnect",
}

interface AlertType {
	type: string;
	msg: string;
}

const socket = connect(SOCKET_URL, {
	query: {
		token: localStorage.getItem(ACCESS_TOKEN),
	},
});

export const useMessages = () => {
	const cache = useRef<RoomsCache>({});
	const [rooms, setRooms] = useState<Room[]>([]);
	const [activeRoom, setActiveRoom] = useState<Room | null>(null);

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
		socket.on(SocketListenerTypes.NEW_MESSAGE, (newMessage: Message) => {
			console.log("got new message", newMessage);
			setActiveRoom((room) => {
				const roomCopy = JSON.parse(JSON.stringify(room));
				roomCopy.messages.push(newMessage);
				return roomCopy;
			});
		});
		socket.on(SocketListenerTypes.ALERT, (data: AlertType) =>
			alert(data.msg)
		);
	}, []);

	const selectRoom = (id: string) => {
		const room = rooms.find((room) => room.id === id);
		if (room) setActiveRoom(room);
	};

	const sendMessage = (message: string) => {
		if (activeRoom && message.trim().length !== 0) {
			socket.emit(SocketEmitTypes.SEND_MESSAGE, {
				roomId: activeRoom.id,
				message,
				createdAt: new Date(),
			});
			console.log("message event emitted");
		}
	};

	const deSelectUser = () => {
		setActiveRoom(null);
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
