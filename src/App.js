// import logo from "./logo.svg";
import "./App.css";
// import Button from "./stories/buttons/Button";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./stories/navbar/navbar";
import Home from "./stories/navbar/Pages/Home";
import About from "./stories/navbar/Pages/About";
// function hello() {
//   alert("clicked");
// }

function App() {
  return (
    <div className="App">
      {/* <Button label="Search" size="large" onClick={hello}></Button> */}
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
