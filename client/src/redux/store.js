import { combineReducers, createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./auth/authReducer";
import strainReducer from "./strain/strainReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  strains: strainReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
