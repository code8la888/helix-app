import axios from "axios";
import { toast } from "react-toastify";

export const sendFormData = async (url, data, navigate, method = "POST") => {
  try {
    const res = await axios({
      method,
      url,
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.data.redirect) {
      if (res.data.message) toast(res.data.message);
      navigate(res.data.redirect);
    } else {
      console.log("請求成功!", res.data);
    }
  } catch (error) {
    let errorMessage = "提交失敗，請稍後再試。";
    let errorStack = "";

    if (error.response) {
      errorMessage = error.response.data.message || "伺服器錯誤。";
      errorStack = error.response.data.stack || "無堆疊資訊";
    } else if (error.request) {
      errorMessage = "伺服器未響應，請稍後再試。";
    } else {
      errorMessage = error.message;
      errorStack = error.stack;
    }

    navigate("/error", { state: { error: errorMessage, stack: errorStack } });
  }
};
