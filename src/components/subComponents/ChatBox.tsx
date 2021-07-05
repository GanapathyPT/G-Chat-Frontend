import { useContext, useEffect, useRef, useState } from "react";
import {
	Button,
	Icon,
	Input,
	Message,
	Popup,
	Segment,
} from "semantic-ui-react";
import { AuthContext } from "../../actions/auth/AuthContext";
import "../../styles/home.scss";
import { Message as MessageType } from "../../types/userTypes";

const getTime = (date: string): string => {
	const givenDate = new Date(date);
	const hours = givenDate.getHours() % 12;
	const time = givenDate.getMinutes();
	return `${hours}:${time}`;
};

function ChatBox({
	messages,
	sendMessage,
	deSelectUser,
}: {
	messages: MessageType[];
	sendMessage: (message: string) => void;
	deSelectUser: () => void;
}) {
	const { authInfo } = useContext(AuthContext);
	const [message, setMessage] = useState<string>("");
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref && ref.current) ref.current.scrollIntoView();
	}, [messages, message, ref]);

	return (
		<Segment className="chat__box">
			<Icon
				className="back__btn"
				name="arrow left"
				size="big"
				onClick={deSelectUser}
			/>
			<Popup
				trigger={
					<Icon className="info__btn" name="info circle" size="big" />
				}
				content={
					<>
						<Message
							warning
							size="small"
							header="Not Encrypted"
							content="messages are not encrypted in this app, don't share any personal info"
						/>
						<Message
							success
							size="small"
							header="Auto Delete"
							content="Messages will be deleted after 24 hours"
						/>
					</>
				}
			/>
			<div className="chat__messages__container">
				{messages.map((message) => (
					<p
						key={message.id}
						className={`chat__message ${
							message.author.id === authInfo.userInfo.id
								? "our__message"
								: ""
						}`}
					>
						<span>
							{message.message}
							<small>{getTime(message.createdAt)}</small>
						</span>
					</p>
				))}
				<div ref={ref} />
			</div>
			<Input
				autoFocus
				value={message}
				className="chat__input"
				onKeyPress={(e: any) => {
					if (e.charCode === 13) {
						sendMessage(e.target.value);
						setMessage("");
					}
				}}
				onChange={(e) => setMessage(e.target.value)}
				label={
					<Button
						primary
						icon
						active
						onClick={() => {
							sendMessage(message);
							setMessage("");
						}}
					>
						<Icon name="send" />
					</Button>
				}
				labelPosition="right"
				placeholder="Type anything . . ."
			/>
		</Segment>
	);
}

export default ChatBox;
