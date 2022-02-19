import { combineReducers } from "redux";
import interactionsReducer from "./interactions";
import gameReducer from "./game";
import uiReducer from "./ui";

export default combineReducers({
    interactions: interactionsReducer,
    game: gameReducer,
    ui: uiReducer
})