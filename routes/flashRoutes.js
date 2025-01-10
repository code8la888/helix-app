const express = require("express");
const router = express.Router();

router.get("/api/flash-messages", (req, res) => {
  res.json({
    success: req.flash("success"),
    error: req.flash("error"),
  });
});

module.exports = router;
