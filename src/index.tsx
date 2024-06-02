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
import {Provider} from 'react-redux';
import { store } from "./redux/store/store";
import { ConfigProvider } from 'antd'
require("dotenv").config();

if (process.env.REACT_APP_ENV === "development") {
  makeServer({
    environment: "development",
  });
}

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider
    theme={{
      token: {
        // Seed Token
        colorPrimary: '#00b96b',
        borderRadius: 5,

        // Alias Token
        colorBgContainer: '#B9C0AB1C',
      },
      components: {
        Button: {
          colorPrimary: '#000000',
          colorBgContainer: '#9BC53D',
          algorithm: true,
          borderRadius: 4,
        },
        Select: {
          colorPrimary: '#cef0d6',
          algorithm: true,
          borderRadius: 3
        },
        Input: {
          colorPrimary: '#cef0d6',
          algorithm: true,
          borderRadius: 3
        },
      }
    }}
    >
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <RecoilRoot>
        <Provider store={store}>
          <App />
          </Provider>
        </RecoilRoot>
      </ThemeProvider>
    </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
