import { combineReducers } from "redux";
import interactionsReducer from "./interactions";

export default combineReducers({
    interactions: interactionsReducer
})