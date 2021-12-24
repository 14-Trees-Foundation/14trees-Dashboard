import { useState, useEffect } from 'react';
import { Switch, Route } from "react-router-dom";
import { Search } from "./pages/Search/Search";
import { Visitor } from "./pages/Visitor/Visitor";
import { AddTree } from "./pages/admin/Addtree/Addtree";
import { AddOrg } from "./pages/admin/Addorg/Addorg";
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/events/Events';
import { Birthday } from './pages/events/Birthday';
import { NotFound } from './pages/notfound/NotFound';
import { Login } from './pages/admin/Login';
import { Admin } from './pages/admin/Admin';
import { AuthContext } from "./pages/admin/context/auth";
import PrivateRoute from './PrivateRoute';
import api from '../src/api/local';

function App() {

  const existingTokens = localStorage.getItem("token");
  const [authTokens, setAuthTokens] = useState(existingTokens);
  let [isLoggedIn, setIsLoggedIn] = useState(false);

  const setTokens = (data) => {
    localStorage.setItem("token", data);
    setAuthTokens(data);
    setIsLoggedIn(true);
  }

  const removeTokens = () => {
    localStorage.removeItem("token")
    setAuthTokens();
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Switch>
        {/* <Route path="/profile/:saplingId" component={Profile} exact></Route> */}
        <Route path='/home' component={() => {
          window.location.href = 'https://14trees.org/';
          return null;
        }} />
        <Route path="/" component={Search} exact></Route>
        <Route path="/search" component={Search} exact></Route>
        <Route path="/visitor" component={Visitor} exact></Route>
        <Route path="/addtree" component={AddTree} exact></Route>
        <Route path="/addorg" component={AddOrg} exact></Route>
        <Route path="/profile/:saplingId" component={Dashboard} exact></Route>
        <Route path="/events/kpit-denso" component={Events} exact></Route>
        <Route path="/events/birthday" component={Birthday} exact></Route>
        <Route exact path="/login" render={
          (props) => <Login {...props} token={authTokens} />
        } />
        <PrivateRoute path="/admin" component={Admin} exact></PrivateRoute>
        <Route component={NotFound} />
      </Switch>
    </AuthContext.Provider>
  );
}

export default App;
