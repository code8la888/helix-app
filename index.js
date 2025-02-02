const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./models/user");
require("./models/strain");
require("./services/passport");

mongoose.connect(keys.mongoURI);

const app = express();
app.use(bodyParser.json());

const path = require("path");

app.use(
  cookieSession({
    maxAge: 3 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000", // 前端地址
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/strains", require("./routes/strains"));
app.use("/api/strains/:strainId/mice", require("./routes/mice"));
app.use(
  "/api/strains/:strainId/breedingRecord",
  require("./routes/breedingRecords")
);
app.use("/", require("./routes/googleAuthRoutes"));
app.use("/", require("./routes/localAuthRoutes"));

app.use((err, req, res, next) => {
  const isDevelopment = keys.env === "development";
  res.status(err.status || 500).json({
    message: err.message,
    stack: isDevelopment ? err.stack : "error", // 僅在開發環境返回堆疊
  });
  console.error(err.stack);
});

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "client", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
