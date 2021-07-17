// import logo from "./logo.svg";
import "./App.css";
import Button from "./stories/buttons/Button";
import Paginate from "./stories/Chips/Paginate";

function hello() {
  alert("clicked");
}

function App() {
  return (
    <div className="App">
      <Button label="Search" size="large" onClick={hello}></Button>
    </div>
  );
}

export default App;
