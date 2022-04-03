import * as React from "react";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  let [user, setUser] = React.useState(null);
  let [token, setToken] = React.useState(null);
  let [permissions, setPermissions] = React.useState([]);
  let [signedin, setSignedin] = React.useState(false);

  let signin = (name, perm, token, callback) => {
    setUser(name);
    setPermissions(perm);
    setToken(token);
    setSignedin(true);
    return callback();
  };

  let signout = (callback) => {
    setUser(null);
    setSignedin(false);
    return callback();
  };

  let value = { user, signedin, token, permissions, signin, signout };

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
