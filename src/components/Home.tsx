import { MouseEvent, useContext } from "react";
import {
	Grid,
	GridColumn,
	GridRow,
	Header,
	Icon,
	SearchProps,
	SearchResultData,
} from "semantic-ui-react";
import { AuthContext } from "../actions/auth/AuthContext";
import { UserInfo } from "../types/authTypes";
import { MessageType, SearchResult } from "../types/userTypes";
import ChatBox from "./subComponents/ChatBox";
import SideBar from "./subComponents/SideBar";
import "../styles/home.scss";
import { AppLoader } from "./AppLoader";

function Home({
	loading,
	onResultSelect,
	onSearchChange,
	results,
	value,
	activeUser,
	messages,
	userOnClick,
	logoutUser,
	sendMessage,
	deSelectUser,
	messagesLoading,
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
	messages: MessageType[];
	userOnClick: (id: string) => void;
	logoutUser: () => Promise<void>;
	sendMessage: (message: string) => void;
	deSelectUser: () => void;
	messagesLoading: boolean;
}) {
	const { authInfo } = useContext(AuthContext);

	return (
		<Grid columns="two" divided className="home__container">
			<GridRow>
				<GridColumn
					computer={4}
					mobile={16}
					className={`full__height ${
						activeUser ? "display__none__mobile" : ""
					}`}
				>
					<Header textAlign="center" size="huge">
						G - Chat
					</Header>
					<SideBar
						loading={loading}
						onResultSelect={onResultSelect}
						onSearchChange={onSearchChange}
						results={results}
						value={value}
						activeUser={activeUser}
						userOnClick={userOnClick}
						logoutUser={logoutUser}
					/>
				</GridColumn>
				<GridColumn
					computer={12}
					mobile={16}
					className={`full_height ${
						activeUser ? "" : "display__none__mobile"
					}`}
				>
					{activeUser ? (
						messagesLoading ? (
							<AppLoader />
						) : (
							<ChatBox
								sendMessage={sendMessage}
								messages={messages}
								deSelectUser={deSelectUser}
							/>
						)
					) : authInfo.userInfo.friends?.length ? (
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
