import { Switch, Route } from "react-router-dom"
import { Search } from "./pages/Search/Search";
import { Visitor } from "./pages/Visitor/Visitor";
import { AddTree } from "./pages/admin/Addtree/Addtree";
import { AddOrg } from "./pages/admin/Addorg/Addorg";
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/events/Events';
import { NotFound } from './pages/notfound/NotFound';

function App() {
  return (
    <Switch>
      {/* <Route path="/profile/:saplingId" component={Profile} exact></Route> */}
      <Route path="/" component={Search} exact></Route>
      <Route path="/search" component={Search} exact></Route>
      <Route path="/visitor" component={Visitor} exact></Route>
      <Route path="/addtree" component={AddTree} exact></Route>
      <Route path="/addorg" component={AddOrg} exact></Route>
      <Route path="/profile/:saplingId" component={Dashboard} exact></Route>
      <Route path="/events/kpit-denso" component={Events} exact></Route>
      <Route path='/home' component={() => {
        window.location.href = 'https://14trees.org/';
        return null;
      }} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
