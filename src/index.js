import React from "react";
import ReactDOM from "react-dom";

import { ThemeProvider } from "@mui/material/styles";

import theme from "./theme";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { makeServer } from "./mockServer/server";
import { RecoilRoot } from "recoil";
require("dotenv").config();

if (process.env.REACT_APP_ENV === "development") {
  makeServer({
    environment: "development",
  });
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
