import { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { Search } from "./pages/Search/Search";
import { Visitor } from "./pages/Visitor/Visitor";
import { AddTree } from "./pages/admin/Addtree/Addtree";
import { AddOrg } from "./pages/admin/Addorg/Addorg";
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/events/Events';
import { NotFound } from './pages/notfound/NotFound';
// import { Login } from './pages/admin/Login';
import { AssignTree } from './pages/admin/AssignTree';
import { Admin } from './pages/admin/Admin';
import { AuthContext } from "./pages/admin/context/auth";
import { Layout } from './components/Layout';
import { GiftTrees } from './pages/ww/GiftTrees';
import { WW } from './pages/ww/WW';
// import PrivateRoute from './PrivateRoute';
// import api from '../src/api/local';

function App() {

  const existingTokens = localStorage.getItem("token");
  const [authTokens, setAuthTokens] = useState(existingTokens);
  // let [isLoggedIn, setIsLoggedIn] = useState(false);

  const setTokens = (data) => {
    localStorage.setItem("token", data);
    setAuthTokens(data);
    // setIsLoggedIn(true);
  }

  // const removeTokens = () => {
  //   localStorage.removeItem("token")
  //   setAuthTokens();
  //   setIsLoggedIn(false);
  // }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Layout>
        <Routes>
          {/* <Route path="/profile/:saplingId" component={Profile} exact></Route> */}
          <Route path='/home' component={() => {
            window.location.href = 'https://14trees.org/';
            return null;
          }} />
          <Route path="/" element={<Search />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/visitor" element={<Visitor />}></Route>
          <Route path="/addtree" element={<AddTree />}></Route>
          <Route path="/addorg" element={<AddOrg />}></Route>
          <Route path="/profile/:saplingId" element={<Dashboard />}></Route>
          <Route path="/events/kpit-denso" element={<Events />}></Route>
          {/* <Route exact path="/login" render={
          (props) => <Login {...props} token={authTokens} />
        } /> */}
          <Route path="/admin" element={<Admin />}>
            <Route path="assigntrees" element={<AssignTree />}></Route>
          </Route>
          <Route path="/ww" element={<WW />}>
            <Route path=":email" element={<GiftTrees />}></Route>
          </Route>
          <Route component={NotFound} />
        </Routes>
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;
