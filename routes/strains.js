const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  verifyAdmin,
  verifyBrowsePermission,
  verifyEditPermission,
  validStrain,
} = require("../middleware.js");
const strains = require("../controllers/strains");

//查詢所有品系
router.get("/", isLoggedIn, catchAsync(strains.index));

//新增品系
router.post(
  "/",
  isLoggedIn,
  verifyAdmin,
  validStrain,
  catchAsync(strains.createNewStrain)
);

// 查詢單一品系及該品系所有小鼠
router.get(
  "/:strainId",
  isLoggedIn,
  verifyBrowsePermission,
  catchAsync(strains.showStrain)
);

//編輯品系表單頁面
router.get(
  "/:strainId/edit",
  isLoggedIn,
  verifyEditPermission,
  catchAsync(strains.renderEditForm)
);

// 更新品系
router.put(
  "/:strainId",
  isLoggedIn,
  verifyEditPermission,
  validStrain,
  catchAsync(strains.updateStrain)
);

//刪除品系
router.delete(
  "/:strainId",
  isLoggedIn,
  verifyEditPermission,
  catchAsync(strains.deleteStrain)
);

router.get(
  "/:strainId/check-permission",
  isLoggedIn,
  verifyEditPermission,
  (req, res) => {
    res.status(200).json({ message: "該使用者有權限方問此頁面" });
  }
);

module.exports = router;
