import { combineReducers } from "redux";
import authReducer from "./authReducer";
import strainReducer from "./strainReducer";

export default combineReducers({
  auth: authReducer,
  strains: strainReducer,
});
