import React from "react";
import { Navbar } from "../Navbar/Navbar";
import "./layout.scss";

export const Layout = (props) => {
  return (
    <div className="layout-container">
      <Navbar/>
      <div className="layout-content">
        {props.children}
      </div>
    </div>
  );
};