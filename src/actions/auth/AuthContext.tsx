import React, { createContext, useReducer } from "react";
import { AuthContextType } from "../../types/authTypes";
import { authReducer, customAuthDispatch, initialState } from "./AuthReducer";

const AuthContext = createContext<AuthContextType>({} as any);

const AuthProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	const contextValue = {
		authInfo: state,
		dispatch: customAuthDispatch(dispatch),
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };
