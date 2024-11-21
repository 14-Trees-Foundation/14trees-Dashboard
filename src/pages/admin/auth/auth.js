import * as React from "react";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  let [user, setUser] = React.useState(null);
  let [token, setToken] = React.useState(null);
  let [permissions, setPermissions] = React.useState([]);
  let [roles, setRoles] = React.useState([]);
  let [signedin, setSignedin] = React.useState(false);

  let signin = (name, perm, roles, token, callback) => {
    setUser(name);
    setPermissions(perm);
    setRoles(roles)
    setToken(token);
    setSignedin(true);
    return callback();
  };

  let signout = (callback) => {
    setUser(null);
    setSignedin(false);
    return callback();
  };

  let value = { user, signedin, token, permissions, roles, signin, signout };

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
