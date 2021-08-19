import "./App.scss";
import { Switch, Route } from "react-router-dom";
import { Profile } from "./pages/profile/Profile"
import { Layout } from "./stories/Layout/Layout";

function App() {
  return (
      <Layout>
        <Switch>
          <Route path="/profile/:saplingId" component={Profile} exact></Route>
        </Switch>
      </Layout>
  );
}

export default App;
