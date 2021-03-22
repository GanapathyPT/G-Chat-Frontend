import { Dispatch, useState } from "react";
import GoogleLogin, {
	GoogleLoginResponse,
	GoogleLoginResponseOffline,
} from "react-google-login";
import { Link } from "react-router-dom";
import { Button, Card, Divider, Form } from "semantic-ui-react";
import { LoginErrors } from "../types/authTypes";

interface Props {
	loginUser: (
		email: string,
		password: string,
		setError: Dispatch<LoginErrors>
	) => void;
	onSuccess: (
		response: GoogleLoginResponse | GoogleLoginResponseOffline
	) => void;
}

function Login({ loginUser, onSuccess }: Props) {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<LoginErrors>({});

	return (
		<div className="login__page">
			<Card color="blue" raised className="login__card">
				<h3>Login</h3>
				<Form onSubmit={() => loginUser(email, password, setError)}>
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
						error={error.password}
					/>
					<Divider horizontal>or</Divider>
					<Form.Field className="btn__center">
						<GoogleLogin
							clientId={
								process.env.REACT_APP_GOOGLE_CLIENT_ID as string
							}
							buttonText="Login with Google"
							onSuccess={onSuccess}
							style={{ width: "100%" }}
						/>
					</Form.Field>
					<Button type="submit" primary>
						Sign In
					</Button>
				</Form>
			</Card>
			<small>
				Don't have a account? <Link to="/register">SignUp</Link>
			</small>
		</div>
	);
}

export { Login };
