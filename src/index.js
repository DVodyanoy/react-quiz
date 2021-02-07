import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import "./index.css";
import App from "./App";
import {Provider} from "react-redux";
import {createStore, compose, applyMiddleware} from "redux";
import rootReducer from "./store/reducers/rootReducer";
import registerServiceWorker from "./registerServiceWorker";
import thunk from "redux-thunk";

const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        }) : compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>)

ReactDOM.render(app, document.getElementById('root'))
registerServiceWorker()
