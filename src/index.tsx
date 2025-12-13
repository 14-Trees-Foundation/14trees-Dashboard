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
import { LocaleProvider } from './components/LocaleProvider';

// Import i18n configuration
import "./i18n";

if (import.meta.env.VITE_USE_MOCK_SERVER === "true") {
  makeServer({
    environment: "development",
  });
}

ReactDOM.render(
  <React.StrictMode>
    <LocaleProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ThemeProvider theme={theme}>
          <RecoilRoot>
          <Provider store={store}>
            <App />
            </Provider>
          </RecoilRoot>
        </ThemeProvider>
      </BrowserRouter>
    </LocaleProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
