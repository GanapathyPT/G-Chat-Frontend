import { Dispatch } from "react";
import {
	AuthInfo,
	AuthStatus,
	AuthError,
	AuthActions,
	AuthActionType,
} from "../../types/authTypes";
import {
	getUserDetails,
	googleAuth,
	login,
	logout,
	refreshToken,
	register,
} from "./authActions";

const initialState: AuthInfo = {
	authStatus: AuthStatus.NOT_AUTHENTICATED,
	userInfo: {},
};

const authReducer = (state: AuthInfo, action: AuthActions) => {
	switch (action.type) {
		case AuthActionType.SET_USERINFO:
			return {
				...state,
				userInfo: action.payload,
			};

		case AuthActionType.SET_AUTHSTATUS:
			return {
				...state,
				authStatus: action.payload,
			};

		case AuthActionType.UPDATE_USERINFO:
			return {
				...state,
				userInfo: {
					...state.userInfo,
					...action.payload,
				},
			};

		default:
			return state;
	}
};

const customAuthDispatch =
	(dispatch: Dispatch<AuthActions>) =>
	async (action: AuthActions): Promise<[AuthError] | undefined> => {
		switch (action.type) {
			case AuthActionType.REGISTER: {
				const { email, password, username } = action.payload;
				const { errors } = await register(username, email, password);
				if (errors === null) {
					const userInfo = await getUserDetails();
					if (userInfo !== null) {
						dispatch({
							type: AuthActionType.SET_USERINFO,
							payload: userInfo,
						});
						dispatch({
							type: AuthActionType.SET_AUTHSTATUS,
							payload: AuthStatus.AUTHENTICATED,
						});
					} else
						dispatch({
							type: AuthActionType.SET_AUTHSTATUS,
							payload: AuthStatus.NOT_AUTHENTICATED,
						});
				} else {
					dispatch({
						type: AuthActionType.SET_AUTHSTATUS,
						payload: AuthStatus.NOT_AUTHENTICATED,
					});
					return errors;
				}
				return;
			}

			case AuthActionType.LOGIN: {
				const { email, password } = action.payload;
				const { errors } = await login(email, password);
				if (errors === null) {
					const userInfo = await getUserDetails();
					if (userInfo !== null) {
						dispatch({
							type: AuthActionType.SET_USERINFO,
							payload: userInfo,
						});
						dispatch({
							type: AuthActionType.SET_AUTHSTATUS,
							payload: AuthStatus.AUTHENTICATED,
						});
					} else
						dispatch({
							type: AuthActionType.SET_AUTHSTATUS,
							payload: AuthStatus.NOT_AUTHENTICATED,
						});
				} else {
					dispatch({
						type: AuthActionType.SET_AUTHSTATUS,
						payload: AuthStatus.NOT_AUTHENTICATED,
					});
					return errors;
				}
				return;
			}

			case AuthActionType.AUTHENTICATE: {
				const { loading } = action.payload;
				loading &&
					dispatch({
						type: AuthActionType.SET_AUTHSTATUS,
						payload: AuthStatus.AUTHENTICATION_LOADING,
					});

				const authenticated = await refreshToken();
				if (authenticated) {
					const userInfo = await getUserDetails();
					if (userInfo !== null) {
						dispatch({
							type: AuthActionType.SET_USERINFO,
							payload: userInfo,
						});
					}
				}
				dispatch({
					type: AuthActionType.SET_AUTHSTATUS,
					payload: authenticated
						? AuthStatus.AUTHENTICATED
						: AuthStatus.NOT_AUTHENTICATED,
				});
				return;
			}

			case AuthActionType.LOGOUT: {
				dispatch({
					type: AuthActionType.SET_AUTHSTATUS,
					payload: AuthStatus.AUTHENTICATION_LOADING,
				});
				await logout();
				dispatch({
					type: AuthActionType.SET_USERINFO,
					payload: {},
				});
				dispatch({
					type: AuthActionType.SET_AUTHSTATUS,
					payload: AuthStatus.NOT_AUTHENTICATED,
				});
				return;
			}

			case AuthActionType.UPDATE_USERINFO: {
				const { email, username } = action.payload;
				if (email)
					dispatch({
						type: AuthActionType.UPDATE_USERINFO,
						payload: {
							email,
						},
					});
				else if (username)
					dispatch({
						type: AuthActionType.UPDATE_USERINFO,
						payload: {
							username,
						},
					});
				return;
			}

			case AuthActionType.SOCIAL_AUTH: {
				dispatch({
					type: AuthActionType.SET_AUTHSTATUS,
					payload: AuthStatus.AUTHENTICATION_LOADING,
				});

				const { token } = action.payload;
				const { errors } = await googleAuth(token);
				if (errors === null) {
					const userInfo = await getUserDetails();
					if (userInfo !== null) {
						dispatch({
							type: AuthActionType.SET_USERINFO,
							payload: userInfo,
						});
						dispatch({
							type: AuthActionType.SET_AUTHSTATUS,
							payload: AuthStatus.AUTHENTICATED,
						});
					} else
						dispatch({
							type: AuthActionType.SET_AUTHSTATUS,
							payload: AuthStatus.NOT_AUTHENTICATED,
						});
				} else {
					dispatch({
						type: AuthActionType.SET_AUTHSTATUS,
						payload: AuthStatus.NOT_AUTHENTICATED,
					});
					return errors;
				}
				return;
			}

			default:
				dispatch(action);
		}
	};

export { authReducer, initialState, customAuthDispatch };
