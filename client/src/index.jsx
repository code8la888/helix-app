import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.jsx";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers";
import { thunk } from "redux-thunk";

const el = document.getElementById("root");
const root = ReactDOM.createRoot(el);

const store = createStore(reducers, {}, applyMiddleware(thunk));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
