import { Dispatch } from "react";
import {
	AuthInfo,
	AuthAction,
	AuthStatus,
	AuthActionType,
	Actions,
	ActionTypes,
	AuthError,
} from "../../types/authTypes";
import { getUserDetails, login, refreshToken, register } from "./authActions";
import { connect } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

const initialState: AuthInfo = {
	authStatus: AuthStatus.NOT_AUTHENTICATED,
	userInfo: {},
	socket: null,
};

const authReducer = (state: AuthInfo, action: AuthAction) => {
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

		case AuthActionType.SET_SOCKET:
			return {
				...state,
				socket: action.payload,
			};

		default:
			return state;
	}
};

const customAuthDispatch = (dispatch: Dispatch<AuthAction>) => async (
	action: Actions
): Promise<[AuthError] | undefined> => {
	switch (action.type) {
		case ActionTypes.REGISTER: {
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
					const socket = connect(SOCKET_URL);
					dispatch({
						type: AuthActionType.SET_SOCKET,
						payload: socket,
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

		case ActionTypes.LOGIN: {
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
					const socket = connect(SOCKET_URL);
					dispatch({
						type: AuthActionType.SET_SOCKET,
						payload: socket,
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

		case ActionTypes.AUTHENTICATE: {
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
					if (loading) {
						const socket = connect(SOCKET_URL);
						dispatch({
							type: AuthActionType.SET_SOCKET,
							payload: socket,
						});
					}
				}
			}
			dispatch({
				type: AuthActionType.SET_AUTHSTATUS,
				payload: authenticated
					? AuthStatus.AUTHENTICATED
					: AuthStatus.NOT_AUTHENTICATED,
			});

			loading &&
				dispatch({
					type: AuthActionType.SET_AUTHSTATUS,
					payload: authenticated
						? AuthStatus.AUTHENTICATED
						: AuthStatus.NOT_AUTHENTICATED,
				});
			return;
		}

		case ActionTypes.UPDATE_USERINFO: {
			const { email, username, friends } = action.payload;
			dispatch({
				type: AuthActionType.SET_USERINFO,
				payload: {
					email,
					username,
					friends,
				},
			});
			return;
		}

		default:
			return;
	}
};

export { authReducer, initialState, customAuthDispatch };
