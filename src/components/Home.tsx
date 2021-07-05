import { useContext } from "react";
import { Grid, GridColumn, GridRow, Header, Icon } from "semantic-ui-react";
import { AuthContext } from "../actions/auth/AuthContext";
import ChatBox from "./subComponents/ChatBox";
import SideBar from "./subComponents/SideBar";
import { useMessages } from "../actions/users/useMessages";
import "../styles/home.scss";

function Home({ logoutUser }: { logoutUser: () => Promise<void> }) {
	const { authInfo } = useContext(AuthContext);
	const {
		activeRoom,
		rooms,
		deSelectUser,
		sendMessage,
		addNewRoom,
		selectRoom,
	} = useMessages();

	return (
		<Grid columns="two" divided className="home__container">
			<GridRow>
				<GridColumn
					computer={4}
					mobile={16}
					className={`full__height ${
						activeRoom ? "display__none__mobile" : ""
					}`}
				>
					<Header textAlign="center" size="huge">
						G - Chat
					</Header>
					<SideBar
						activeRoom={activeRoom}
						rooms={rooms}
						selectRoom={selectRoom}
						logoutUser={logoutUser}
						addNewRoom={addNewRoom}
					/>
				</GridColumn>
				<GridColumn
					computer={12}
					mobile={16}
					className={`full_height ${
						activeRoom ? "" : "display__none__mobile"
					}`}
				>
					{activeRoom ? (
						<ChatBox
							sendMessage={sendMessage}
							messages={activeRoom.messages}
							deSelectUser={deSelectUser}
						/>
					) : rooms?.length ? (
						<div className="full__height center">
							<Header as="h2" icon>
								<Icon name="user" />
								Select a Friend to Chat
								<Header.Subheader>
									select the friend from the sidebar to chat
								</Header.Subheader>
							</Header>
						</div>
					) : (
						<div className="full__height center">
							<Header as="h2" icon>
								<Icon name="hand peace" />
								Hii {authInfo.userInfo.username}
								<Header.Subheader>
									search for admin to chat with me
								</Header.Subheader>
							</Header>
						</div>
					)}
				</GridColumn>
			</GridRow>
		</Grid>
	);
}

export { Home };
