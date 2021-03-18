import { Dispatch, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Form } from "semantic-ui-react";
import { LoginErrors } from "../types/authTypes";

interface Props {
	loginUser: (
		email: string,
		password: string,
		setError: Dispatch<LoginErrors>
	) => void;
}

function Login({ loginUser }: Props) {
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
