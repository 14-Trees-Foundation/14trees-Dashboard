import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Navbar } from "./stories/Navbar/Navbar";

function App() {
  return (
      <Router>
        <Navbar />
        {/* <Switch> */}
          {/* <Route path="/" exact component={} />
          <Route path="/about" component={} /> */}
        {/* </Switch> */}
      </Router>
  );
}

export default App;
