import { Dispatch, useCallback, useContext } from "react";
import {
	GoogleLoginResponse,
	GoogleLoginResponseOffline,
} from "react-google-login";
import { Redirect } from "react-router";
import { AuthContext } from "../actions/auth/AuthContext";
import { Login } from "../components/Login";
import { ActionTypes, AuthStatus, LoginErrors } from "../types/authTypes";

function LoginContainer() {
	const { authInfo, dispatch } = useContext(AuthContext);

	const loginUser = useCallback(
		async (
			email: string,
			password: string,
			setError: Dispatch<LoginErrors>
		) => {
			setError({});
			const errors = await dispatch({
				type: ActionTypes.LOGIN,
				payload: {
					email,
					password,
				},
			});
			if (errors !== undefined) {
				const allErrors: LoginErrors = {};
				errors.forEach((error) => {
					switch (error.param) {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const onSuccess = (
		response: GoogleLoginResponse | GoogleLoginResponseOffline
	) => {
		const gResponse = response as GoogleLoginResponse;
		// console.log(response);
		// googleAuth(gResponse.tokenId);
		dispatch({
			type: ActionTypes.SOCIAL_AUTH,
			payload: {
				token: gResponse.tokenId,
			},
		});
	};

	if (authInfo.authStatus === AuthStatus.AUTHENTICATED)
		return <Redirect to="/" />;

	return <Login loginUser={loginUser} onSuccess={onSuccess} />;
}

export { LoginContainer };
