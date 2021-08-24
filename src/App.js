import "./App.scss";
import { Switch, Route } from "react-router-dom";
import { Profile } from "./pages/profile/Profile"
import { Layout } from "./stories/Layout/Layout";
import { Search } from "./pages/Search/Search";
import { NotFound } from "./pages/notfound/NotFound";

function App() {
  return (
      <Layout>
        <Switch>
          <Route path="/profile/:saplingId" component={Profile} exact></Route>
          <Route path="/search" component={Search} exact></Route>
          <Route component={NotFound} />
        </Switch>
      </Layout>
  );
}

export default App;
