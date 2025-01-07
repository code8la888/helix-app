const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const breedingRecords = require("../controllers/breedingRecords");
const {
  isLoggedIn,
  verifyEditPermission,
  validBreedingRecord,
} = require("../middleware.js");

//新增繁殖記錄
router.post(
  "/",
  isLoggedIn,
  verifyEditPermission,
  validBreedingRecord,
  catchAsync(breedingRecords.createBreedingRecord)
);

//新增繁殖記錄表單
router.get(
  "/new",
  isLoggedIn,
  verifyEditPermission,
  breedingRecords.renderNewForm
);

router
  .route("/:breedingRecordId")
  .put(
    //修改繁殖記錄
    isLoggedIn,
    verifyEditPermission,
    validBreedingRecord,
    catchAsync(breedingRecords.updateBreedingRecord)
  )
  .delete(
    //刪除繁殖記錄
    isLoggedIn,
    verifyEditPermission,
    catchAsync(breedingRecords.deleteBreedingRecord)
  );

//編輯繁殖記錄表單
router.get(
  "/:breedingRecordId/edit",
  isLoggedIn,
  verifyEditPermission,
  catchAsync(breedingRecords.renderEditForm)
);

module.exports = router;
