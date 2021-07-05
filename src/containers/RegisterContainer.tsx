import { Dispatch, useCallback, useContext } from "react";
import {
	GoogleLoginResponse,
	GoogleLoginResponseOffline,
} from "react-google-login";
import { Redirect } from "react-router";
import { AuthContext } from "../actions/auth/AuthContext";
import { Register } from "../components/Register";
import { AuthActionType, AuthStatus, RegisterErrors } from "../types/authTypes";

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
				type: AuthActionType.REGISTER,
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
			type: AuthActionType.SOCIAL_AUTH,
			payload: {
				token: gResponse.tokenId,
			},
		});
	};

	if (authInfo.authStatus === AuthStatus.AUTHENTICATED)
		return <Redirect to="/" />;

	return <Register registerUser={registerUser} onSuccess={onSuccess} />;
}

export { RegisterContainer };
