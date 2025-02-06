const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  verifyBrowsePermission,
  verifyEditPermission,
  validStrain,
} = require("../middleware.js");
const strains = require("../controllers/strains");

//查詢所有品系
router.get("/", isLoggedIn, catchAsync(strains.index));

//新增品系
router.post("/", isLoggedIn, validStrain, catchAsync(strains.createNewStrain));

// 查詢單一品系及該品系所有小鼠
router.get(
  "/:strainId",
  isLoggedIn,
  verifyBrowsePermission,
  catchAsync(strains.showStrain)
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

//確認編輯權限
router.get(
  "/:strainId/edit-permission",
  isLoggedIn,
  verifyEditPermission,
  (req, res) => {
    res.status(200).json({ message: "該使用者有權限訪問及編輯此頁面" });
  }
);

//確認瀏覽權限
router.get(
  "/:strainId/browse-permission",
  isLoggedIn,
  verifyBrowsePermission,
  (req, res) => {
    res.status(200).json({ message: "該使用者有權限訪問此頁面" });
  }
);

module.exports = router;
