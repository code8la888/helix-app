import axios from "axios";
import { FETCH_USER, DELETE_ACCOUNT } from "./types";
export const fetchUser = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get("/api/current_user");
      dispatch({ type: FETCH_USER, payload: res.data || false });
    } catch (error) {
      console.error("獲取使用者失敗:", error);
      dispatch({ type: FETCH_USER, payload: false });
    }
  };
};

export const deleteAccount = (userId, navigate) => async (dispatch) => {
  try {
    await axios.delete(`/api/users/${userId}`);
    dispatch({ type: DELETE_ACCOUNT });
    navigate("/home");
  } catch (error) {
    console.error("刪除帳戶失敗:", error);
  }
};
