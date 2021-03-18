import { MouseEvent, useContext } from "react";
import {
	Grid,
	GridColumn,
	GridRow,
	Header,
	Icon,
	Item,
	SearchProps,
	SearchResultData,
} from "semantic-ui-react";
import { AuthContext } from "../actions/auth/AuthContext";
import { UserInfo } from "../types/authTypes";
import { Message, SearchResult } from "../types/userTypes";
import ChatBox from "./subComponents/ChatBox";
import SideBar from "./subComponents/SideBar";

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
	messages: Message[];
	userOnClick: (id: string) => void;
	logoutUser: () => Promise<void>;
	sendMessage: (message: string) => void;
}) {
	const { authInfo } = useContext(AuthContext);

	return (
		<Grid columns="two" divided className="home__container">
			<GridRow>
				<GridColumn computer={4} className="full__height">
					<Header textAlign="center" size="huge">
						Pigeon Messenger
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
				<GridColumn computer={12} className="full__height">
					{activeUser ? (
						<ChatBox
							sendMessage={sendMessage}
							messages={messages}
						/>
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
									search for your friend name and click to add
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
