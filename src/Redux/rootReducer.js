import { combineReducers } from "redux";
import connectReducer from "./connection/reducer";

const rootReducer = combineReducers({
  connect: connectReducer,
});

export default rootReducer;
