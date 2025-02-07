const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const mice = require("../controllers/mice.js");
const {
  isLoggedIn,
  verifyEditPermission,
  validateMouse,
  validateObjectId,
} = require("../middleware.js");

router
  .route("/new")
  .get(
    //新增採樣記錄表單頁面(屬於某品系)
    isLoggedIn,
    verifyEditPermission,
    catchAsync(mice.renderNewForm)
  )
  .post(
    //新增採樣記錄
    isLoggedIn,
    verifyEditPermission,
    validateMouse,
    catchAsync(mice.createNewMouse)
  );

//編輯採樣記錄表單
router.get(
  "/:mouseId/edit",
  validateObjectId,
  isLoggedIn,
  verifyEditPermission,
  catchAsync(mice.renderEditForm)
);

router
  .route("/:mouseId")
  .put(
    //更新採樣記錄
    validateObjectId,
    isLoggedIn,
    verifyEditPermission,
    validateMouse,
    catchAsync(mice.updateMouse)
  )
  .delete(
    //刪除採樣記錄
    validateObjectId,
    isLoggedIn,
    verifyEditPermission,
    catchAsync(mice.deleteMouse)
  );

module.exports = router;
