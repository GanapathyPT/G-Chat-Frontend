import { useContext, useEffect } from "react";
// importing the semantic ui css before all component
// so that custom css will override this css
import "semantic-ui-css/semantic.min.css";
import "./App.scss";
import "./styles/home.scss";
import "./styles/auth.scss";
import {
	Switch,
	Route,
	BrowserRouter as Router,
	Redirect,
} from "react-router-dom";
import { AuthContext } from "./actions/auth/AuthContext";
import { ActionTypes, AuthStatus } from "./types/authTypes";
import { AppLoader } from "./components/AppLoader";
import { LoginContainer } from "./containers/LoginContainer";
import { RegisterContainer } from "./containers/RegisterContainer";
import { HomeContainer } from "./containers/HomeContainer";

const App = () => {
	const { authInfo, dispatch } = useContext(AuthContext);

	useEffect(() => {
		const authenticate = (showLoading = false) => {
			dispatch({
				type: ActionTypes.AUTHENTICATE,
				payload: {
					loading: showLoading,
				},
			});
		};
		authenticate(true);
		const interval = setInterval(authenticate, 1000 * 60 * 60);
		return () => clearInterval(interval);
	}, []);

	if (authInfo.authStatus === AuthStatus.AUTHENTICATION_LOADING)
		return <AppLoader />;

	return (
		<Router>
			<Switch>
				<Route exact path="/" component={HomeContainer} />
				<Route path="/login" component={LoginContainer} />
				<Route path="/register" component={RegisterContainer} />
				<Route path="/" component={() => <Redirect to="/login" />} />
			</Switch>
		</Router>
	);
};

export default App;
