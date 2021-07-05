import { useContext } from "react";
import { Redirect } from "react-router";
import { AuthContext } from "../actions/auth/AuthContext";
import { Home } from "../components/Home";
import { AuthActionType, AuthStatus } from "../types/authTypes";

function HomeContainer() {
	const { authInfo, dispatch } = useContext(AuthContext);

	const logoutUser = async () => {
		dispatch({
			type: AuthActionType.LOGOUT,
		});
	};

	if (authInfo.authStatus !== AuthStatus.AUTHENTICATED)
		return <Redirect to="/login" />;

	return <Home logoutUser={logoutUser} />;
}

export { HomeContainer };
