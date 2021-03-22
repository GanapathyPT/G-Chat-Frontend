import { User } from "./userTypes";

interface AuthError {
	value?: string;
	msg: string;
	param: string;
	location?: string;
}

interface AuthResponse {
	errors: [AuthError] | null;
	accessToken?: string;
	refreshToken?: string;
}

interface RegisterErrors {
	username?: string;
	email?: string;
	password?: string;
}

interface LoginErrors {
	email?: string;
	password?: string;
}

interface UserInfo {
	_id?: string;
	username?: string;
	email?: string;
	friends?: User[];
}

// Reducer and context related
enum AuthStatus {
	NOT_AUTHENTICATED = 0,
	AUTHENTICATED = 1,
	AUTHENTICATION_LOADING = 2,
}

interface AuthInfo {
	authStatus: AuthStatus;
	userInfo: UserInfo;
	socket: SocketIOClient.Socket | null;
}

interface AuthContextType {
	authInfo: AuthInfo;
	dispatch: (action: Actions) => Promise<AuthError[] | undefined>;
}

// actions related

enum ActionTypes {
	REGISTER = 0,
	LOGIN = 1,
	AUTHENTICATE = 2,
	UPDATE_USERINFO = 3,
	SOCIAL_AUTH = 4,
}

interface Register {
	type: ActionTypes.REGISTER;
	payload: {
		username: string;
		email: string;
		password: string;
	};
}

interface Login {
	type: ActionTypes.LOGIN;
	payload: {
		email: string;
		password: string;
	};
}

interface Authenticate {
	type: ActionTypes.AUTHENTICATE;
	payload: {
		loading: boolean;
	};
}

interface UpdateUserInfo {
	type: ActionTypes.UPDATE_USERINFO;
	payload: Partial<UserInfo>;
}

interface SocialLogin {
	type: ActionTypes.SOCIAL_AUTH;
	payload: {
		token: string;
	};
}

type Actions = Register | Login | Authenticate | UpdateUserInfo | SocialLogin;

// reducer related
enum AuthActionType {
	SET_USERINFO = 0,
	SET_AUTHSTATUS = 1,
	UPDATE_USERINFO = 2,
	SET_SOCKET = 4,
}

interface SetUserInfo {
	type: AuthActionType.SET_USERINFO;
	payload: UserInfo;
}

interface SetAuthStatus {
	type: AuthActionType.SET_AUTHSTATUS;
	payload: AuthStatus;
}

interface Update {
	type: AuthActionType.UPDATE_USERINFO;
	payload: Partial<UserInfo>;
}

interface SetSocket {
	type: AuthActionType.SET_SOCKET;
	payload: SocketIOClient.Socket;
}

type AuthAction = SetUserInfo | SetAuthStatus | Update | SetSocket;

export type {
	AuthResponse,
	RegisterErrors,
	LoginErrors,
	AuthContextType,
	UserInfo,
	AuthInfo,
	AuthAction,
	Actions,
	AuthError,
};

export { AuthStatus, AuthActionType, ActionTypes };
