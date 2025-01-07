const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");
const keys = require("./config/keys");
require("./models/User");
require("./services/passport");

mongoose.connect(keys.mongoURI);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(
  cookieSession({
    maxAge: 15 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/strains", require("./routes/strains"));
app.use("/strains/:strainId/mice", require("./routes/mice"));
app.use(
  "/strains/:strainId/breedingRecord",
  require("./routes/breedingRecords")
);
app.use("/", require("./routes/googleAuthRoutes"));
app.use("/", require("./routes/localAuthRoutes"));

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "client", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
