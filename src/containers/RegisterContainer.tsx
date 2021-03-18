import { Dispatch, useCallback, useContext } from "react";
import { Redirect } from "react-router";
import { AuthContext } from "../actions/auth/AuthContext";
import { Register } from "../components/Register";
import { ActionTypes, AuthStatus, RegisterErrors } from "../types/authTypes";

function RegisterContainer() {
	const { authInfo, dispatch } = useContext(AuthContext);

	const registerUser = useCallback(
		async (
			username: string,
			email: string,
			password: string,
			setError: Dispatch<RegisterErrors>
		) => {
			setError({});
			const errors = await dispatch({
				type: ActionTypes.REGISTER,
				payload: {
					username,
					email,
					password,
				},
			});
			if (errors !== undefined) {
				const allErrors: RegisterErrors = {};
				errors.forEach((error) => {
					switch (error.param) {
						case "username":
							allErrors.username = error.msg;
							break;
						case "email":
							allErrors.email = error.msg;
							break;
						case "password":
							allErrors.password = error.msg;
							break;
					}
				});
				setError(allErrors);
			}
		},
		[]
	);
	if (authInfo.authStatus === AuthStatus.AUTHENTICATED)
		return <Redirect to="/" />;

	return <Register registerUser={registerUser} />;
}

export { RegisterContainer };
