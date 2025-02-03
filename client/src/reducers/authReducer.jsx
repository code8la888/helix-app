import { FETCH_USER, DELETE_ACCOUNT } from "../actions/types";
export default function (state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false;
    case DELETE_ACCOUNT:
      return null;
    default:
      return state;
  }
}
