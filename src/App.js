import { Switch, Route } from "react-router-dom";
import { Profile } from "./pages/UserProfile/Profile"
import { Search } from "./pages/Search/Search";
import { Visitor } from "./pages/Visitor/Visitor";
import { AddTree } from "./pages/admin/Addtree/Addtree";
import { Trees } from "./pages/Trees/Trees";

function App() {
  return (
    <Switch>
      <Route path="/search" component={Search} exact></Route>
      <Route path="/" component={Search} exact></Route>
      <Route path="/profile/:saplingId" component={Profile} exact></Route>
      <Route path="/visitor" component={Visitor} exact></Route>
      <Route path="/addtree" component={AddTree} exact></Route>
      <Route path="/trees" component={Trees} exact></Route>
      {/* <Route component={NotFound} /> */}
    </Switch>
  );
}

export default App;
