module.exports.handleErrors = (err, req, res, next) => {
  console.error("錯誤發生:", err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "伺服器發生錯誤";
  const stack = err.stack || "無堆疊訊息";

  if (err.name === "AuthenticationError") {
    return res.status(401).json({
      message: err.message || "帳號或密碼錯誤，請再試一次！",
    });
  }

  return res.status(statusCode).json({ message, stack });
};
