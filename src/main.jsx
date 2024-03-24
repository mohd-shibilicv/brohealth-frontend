import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import store, { persistor } from "./store/index.js";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <Router>
        <App />
      </Router>
    </PersistGate>
  </Provider>
);
