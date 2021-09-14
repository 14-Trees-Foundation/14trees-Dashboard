import React from "react";
import { AppBar } from "../AppBar/AppBar";
import "./layout.scss";

export const Layout = (props) => {
  return (
    <div className="layout-container">
      <AppBar/>
      <div className="layout-content">
        {props.children}
      </div>
    </div>
  );
};