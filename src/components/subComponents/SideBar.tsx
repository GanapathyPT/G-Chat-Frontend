import { MouseEvent, useContext } from "react";
import {
	Dropdown,
	Image,
	List,
	Search,
	SearchProps,
	SearchResultData,
} from "semantic-ui-react";
import { AuthContext } from "../../actions/auth/AuthContext";
import { UserInfo } from "../../types/authTypes";
import { SearchResult } from "../../types/userTypes";

function SideBar({
	loading,
	onResultSelect,
	onSearchChange,
	results,
	value,
	activeUser,
	userOnClick,
	logoutUser,
}: {
	loading: boolean;
	onResultSelect: (
		e: MouseEvent<HTMLDivElement>,
		data: SearchResultData
	) => Promise<void>;
	onSearchChange: (
		e: MouseEvent<HTMLElement>,
		data: SearchProps
	) => Promise<void>;
	results: SearchResult[];
	value: string;
	activeUser: UserInfo | null;
	userOnClick: (id: string) => void;
	logoutUser: () => Promise<void>;
}) {
	const { authInfo } = useContext(AuthContext);

	return (
		<>
			<div className="search__menu">
				<Search
					placeholder="Search User . . ."
					loading={loading}
					onResultSelect={onResultSelect}
					onSearchChange={onSearchChange}
					results={results}
					value={value}
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
				{authInfo.userInfo.friends?.map((friend) => (
					<List.Item
						key={friend._id}
						active={activeUser?._id === friend._id}
						className="list__item"
						onClick={() => userOnClick(friend._id)}
					>
						<Image
							avatar
							src="https://react.semantic-ui.com/images/avatar/small/rachel.png"
						/>
						<List.Content>
							<List.Header>{friend.username}</List.Header>
							<List.Description>Hi there</List.Description>
						</List.Content>
					</List.Item>
				))}
			</List>
		</>
	);
}

export default SideBar;
