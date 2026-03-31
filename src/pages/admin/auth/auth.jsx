import * as React from 'react';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
	let [user, setUser] = React.useState(null);
	let [userId, setUserId] = React.useState(null);
	let [token, setToken] = React.useState(null);
	let [permissions, setPermissions] = React.useState([]);
	let [roles, setRoles] = React.useState([]);
	let [rbacPermissions, setRbacPermissions] = React.useState([]);
	let [signedin, setSignedin] = React.useState(false);

	let signin = (
		name,
		email,
		userId,
		perm,
		roles,
		token,
		callback,
		rbacPerms = [],
	) => {
		setUser(name);
		localStorage.setItem('userName', name);
		localStorage.setItem('userEmail', email);
		localStorage.setItem('userId', userId);
		setUserId(userId);
		setPermissions(perm);
		setRoles(roles);
		setRbacPermissions(rbacPerms);
		localStorage.setItem('rbacPermissions', JSON.stringify(rbacPerms));
		setToken(token);
		setSignedin(true);
		return callback();
	};

	let signout = (callback) => {
		localStorage.removeItem('userName');
		localStorage.removeItem('userEmail');
		localStorage.removeItem('rbacPermissions');
		setUser(null);
		setRbacPermissions([]);
		setSignedin(false);
		return callback();
	};

	let value = {
		user,
		userId,
		signedin,
		token,
		permissions,
		roles,
		rbacPermissions,
		signin,
		signout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
	return React.useContext(AuthContext);
}

export function AuthStatus() {
	let auth = useAuth();
	if (auth.signedin) {
		return true;
	} else {
		return false;
	}
}
