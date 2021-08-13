import React from "react";
import { Link } from "react-router-dom";
import Button from "D:/Project/14treesapp/src/stories/buttons/Button";
import "./navbar.scss";

const Navbar = () => {
  return (
    <div className="nav">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">Events</Link>
        </li>
        <li>
          <Link to="/about">Search</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/login">
            <Button label="Login" size="large" id="btn"></Button>
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default Navbar;
