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
import { MessageType } from "../../types/userTypes";
import "../../styles/home.scss";

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
	}, [messages, ref]);

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
					<Message
						warning
						size="small"
						header="Not Encrypted"
						content="messages are not encrypted in this app, don't share any personal info"
					/>
				}
			/>
			<div className="chat__messages__container">
				{messages.map((message) => (
					<p
						key={message._id}
						className={`chat__message ${
							message.author === authInfo.userInfo._id
								? "our__message"
								: ""
						}`}
					>
						<span>{message.message}</span>
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
