import { useContext } from "react";
import { Dropdown, Image, List, Search, Label } from "semantic-ui-react";
import { AuthContext } from "../../actions/auth/AuthContext";
import { useUserSearch } from "../../actions/users/useUserSearch";
import { UserInfo } from "../../types/authTypes";
import { Room } from "../../types/userTypes";

const usersAvatar = [
	"rachel.png",
	"lindsay.png",
	"matthew.png",
	"jenny.jpg",
	"veronika.jpg",
	"tom.jpg",
	"christian.jpg",
	"matt.jpg",
	"daniel.jpg",
];
const getRandomAvatar = () =>
	"https://react.semantic-ui.com/images/avatar/small/" +
	usersAvatar[Math.floor(Math.random() * usersAvatar.length)];
const getOnlineStatus = (room: Room, userInfo: UserInfo): boolean =>
	room.isPersonal &&
	room.users.some((user) => user.id !== userInfo.id && user.online);

function SideBar({
	activeRoom,
	rooms,
	logoutUser,
	selectRoom,
	addNewRoom,
}: {
	activeRoom: Room | null;
	rooms: Room[];
	logoutUser: () => Promise<void>;
	selectRoom: (id: string) => void;
	addNewRoom: (room: Room) => void;
}) {
	const { authInfo } = useContext(AuthContext);
	const {
		onSearchChange,
		onResultSelect,
		searchLoading,
		searchResult,
		searchText,
	} = useUserSearch(rooms, addNewRoom);

	return (
		<div>
			<div className="search__menu">
				<Search
					placeholder="Search User . . ."
					loading={searchLoading}
					onResultSelect={onResultSelect}
					onSearchChange={onSearchChange}
					results={searchResult}
					value={searchText}
				/>
				<Dropdown
					simple
					className="menu__dropdown"
					direction="left"
					icon="ellipsis vertical"
				>
					<Dropdown.Menu>
						<Dropdown.Item onClick={logoutUser}>
							Logout
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
			<List animated celled size="big" className="friends__list">
				{rooms.map((room) => (
					<List.Item
						key={room.id}
						active={activeRoom?.id === room.id}
						className="list__item"
						onClick={() => selectRoom(room.id)}
					>
						<div className="profile__pic">
							<Image
								avatar
								src={
									authInfo.userInfo.profilePic
										? authInfo.userInfo.profilePic
										: getRandomAvatar()
								}
							/>
							{getOnlineStatus(room, authInfo.userInfo) ? (
								<Label circular empty color="green" floating />
							) : null}
						</div>
						<List.Content>
							<List.Header>{room.name}</List.Header>
							<List.Description className="item__description">
								{room.messages.length > 0
									? room.messages[room.messages.length - 1]
											.message
									: "..........."}
							</List.Description>
						</List.Content>
					</List.Item>
				))}
			</List>
		</div>
	);
}

export default SideBar;
