import { Dispatch, useState } from "react";
import GoogleLogin, {
	GoogleLoginResponse,
	GoogleLoginResponseOffline,
} from "react-google-login";
import { Link } from "react-router-dom";
import { Button, Card, Divider, Form } from "semantic-ui-react";
import { RegisterErrors } from "../types/authTypes";

interface Props {
	registerUser: (
		username: string,
		email: string,
		password: string,
		setError: Dispatch<RegisterErrors>
	) => void;
	onSuccess: (
		response: GoogleLoginResponse | GoogleLoginResponseOffline
	) => void;
}

function Register({ registerUser, onSuccess }: Props) {
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<RegisterErrors>({});

	return (
		<div className="login__page">
			<Card color="blue" raised className="login__card">
				<h3>Register</h3>
				<Form
					onSubmit={() =>
						registerUser(username, email, password, setError)
					}
				>
					<Form.Input
						label="User Name"
						placeholder="username"
						icon="user"
						iconPosition="left"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						error={error.username}
					/>
					<Form.Input
						label="Email"
						placeholder="email"
						icon="mail"
						iconPosition="left"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						error={error.email}
					/>
					<Form.Input
						label="Password"
						placeholder="password"
						type="password"
						icon="key"
						iconPosition="left"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						error={
							(password === password.toLowerCase() &&
								"must contain a upper case") ||
							error.password
						}
					/>
					<Divider horizontal>or</Divider>
					<Form.Field className="btn__center">
						<GoogleLogin
							clientId={
								process.env.REACT_APP_GOOGLE_CLIENT_ID as string
							}
							buttonText="Register with Google"
							onSuccess={onSuccess}
							cookiePolicy="single_host_origin"
						/>
					</Form.Field>
					<Button type="submit" primary>
						Sign Up
					</Button>
				</Form>
			</Card>
			<small>
				Already have a account? <Link to="/login">Login</Link>
			</small>
		</div>
	);
}

export { Register };
