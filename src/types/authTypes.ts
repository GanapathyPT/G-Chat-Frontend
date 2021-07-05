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
	id?: string;
	username?: string;
	email?: string;
	profilePic?: string;
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
}

interface AuthContextType {
	authInfo: AuthInfo;
	dispatch: (action: AuthActions) => Promise<AuthError[] | undefined>;
}

// actions related
enum AuthActionType {
	// generic action types
	REGISTER = 0,
	LOGIN = 1,
	LOGOUT = 2,
	AUTHENTICATE = 3,
	UPDATE_USERINFO = 4,
	SOCIAL_AUTH = 5,

	// reducer action types
	SET_USERINFO = 6,
	SET_AUTHSTATUS = 7,
}

// reducer actions
interface Register {
	type: AuthActionType.REGISTER;
	payload: {
		username: string;
		email: string;
		password: string;
	};
}

interface Login {
	type: AuthActionType.LOGIN;
	payload: {
		email: string;
		password: string;
	};
}

interface Authenticate {
	type: AuthActionType.AUTHENTICATE;
	payload: {
		loading: boolean;
	};
}

interface UpdateUserInfo {
	type: AuthActionType.UPDATE_USERINFO;
	payload: Partial<UserInfo>;
}

interface SocialLogin {
	type: AuthActionType.SOCIAL_AUTH;
	payload: {
		token: string;
	};
}

// generic actions
interface Logout {
	type: AuthActionType.LOGOUT;
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

type AuthActions =
	// generic actions
	| Register
	| Login
	| Authenticate
	| UpdateUserInfo
	| SocialLogin
	| Logout
	// reducer actions
	| SetUserInfo
	| SetAuthStatus
	| Update;

export type {
	AuthResponse,
	RegisterErrors,
	LoginErrors,
	AuthContextType,
	UserInfo,
	AuthInfo,
	AuthError,
	AuthActions,
};

export { AuthStatus, AuthActionType };
