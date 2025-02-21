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

router.route("/").post(
  //新增採樣紀錄
  isLoggedIn,
  verifyEditPermission,
  validateMouse,
  catchAsync(mice.createNewMouse)
);

router.route("/new").get(
  //新增採樣紀錄表單頁面(屬於某品系)
  isLoggedIn,
  verifyEditPermission,
  catchAsync(mice.renderNewForm)
);

//編輯採樣紀錄表單
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
    //更新採樣紀錄
    validateObjectId,
    isLoggedIn,
    verifyEditPermission,
    validateMouse,
    catchAsync(mice.updateMouse)
  )
  .delete(
    //刪除採樣紀錄
    validateObjectId,
    isLoggedIn,
    verifyEditPermission,
    catchAsync(mice.deleteMouse)
  );

module.exports = router;
