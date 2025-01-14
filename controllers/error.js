module.exports.handleErrors = (err, req, res, next) => {
  if (err.name === "AuthenticationError") {
    return res.status(401).json({
      success: false,
      message: err.message || "帳號或密碼錯誤！",
    });
  }

  console.error(err.stack);
  return res.status(500).json({
    success: false,
    message: "伺服器發生錯誤，請稍後再試。",
  });
};
