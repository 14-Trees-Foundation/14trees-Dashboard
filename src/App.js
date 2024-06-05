import { Route, Routes } from "react-router-dom";
import { Search } from "./pages/Search/Search";
import { Visitor } from "./pages/Visitor/Visitor";
import { AddTree } from "./pages/admin/Forms/components/Addtree";
import { AddOrg } from "./pages/admin/Forms/components/Addorg";
import { Dashboard } from "./pages/Dashboard";
import { Events } from "./pages/events/Events";
import { NotFound } from "./pages/notfound/NotFound";
import { AssignTree } from "./pages/admin/Forms/components/AssignTree";
import { Admin } from "./pages/admin/Admin";
import { Layout } from "./components/Layout";
import { GiftTrees } from "./pages/ww/GiftTrees";
import { WW } from "./pages/ww/WW";
// import { AdminLogin } from "./pages/admin/GoogleLogin";
import { RequireAuth } from "./pages/admin/auth/RequireAuth";
import { AuthProvider } from "./pages/admin/auth/auth";
import { Login } from "./pages/admin/Login/Login";
import { Forms } from "./pages/admin/Forms/Forms";
import { Birthday } from "./pages/events/Birthday";
import { VisitorNew } from "./pages/Visitor/Visitor2";
import { OrgEvent } from "./pages/events/OrgEvent";
import { Corporate } from "./pages/events/Corporate";
import { Test } from "./pages/test/test";

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route
            path="/home"
            component={() => {
              window.location.href = "https://14trees.org/";
              return null;
            }}
          />
          <Route path="/" element={<Search />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/visitor" element={<Visitor />}></Route>
          <Route path="/visitornew" element={<VisitorNew />}></Route>
          <Route path="/addtree" element={<AddTree />}></Route>
          <Route path="/profile/:saplingId" element={<Dashboard />}></Route>
          <Route path="/group/:grptype" element={<OrgEvent />}></Route>
          <Route path="/events/corp/:event_id" element={<Corporate />}></Route>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <Admin />
              </RequireAuth>
            }
          >
            <Route path="forms" element={<Forms />}>
              <Route path="assigntrees" element={<AssignTree />}></Route>
              <Route path="addorg" element={<AddOrg />}></Route>
            </Route>
          </Route>
          <Route path="/ww" element={<WW />}>
            <Route 
              path=":email" 
              element={ 
                <RequireAuth>
                  <GiftTrees />
                </RequireAuth>
              } 
            ></Route>
          </Route>
          <Route path="/events" element={<Events />}>
            <Route path="birthday/:id" element={<Birthday />}></Route>
          </Route>
          <Route path="/notfound" element={<NotFound />} />
          <Route 
            path="/test" 
            element={
              <RequireAuth>
                <Test />
              </RequireAuth>
            } 
          />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
