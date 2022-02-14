import { compose, applyMiddleware, createStore } from "redux";
import reducers from "./reducers";
import middlewares from "./middlewares";

export const configureStore = (services: any) => createStore(
    reducers,
    compose(applyMiddleware(...middlewares.map(fn=> fn(services))))
);