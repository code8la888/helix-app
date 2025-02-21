const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const breedingRecords = require("../controllers/breedingRecords");
const {
  isLoggedIn,
  verifyEditPermission,
  validBreedingRecord,
  validateObjectId,
} = require("../middleware.js");

//新增繁殖紀錄
router.post(
  "/",
  isLoggedIn,
  verifyEditPermission,
  validBreedingRecord,
  catchAsync(breedingRecords.createBreedingRecord)
);

//新增繁殖紀錄表單
router.get(
  "/new",
  isLoggedIn,
  verifyEditPermission,
  breedingRecords.renderNewForm
);

router
  .route("/:breedingRecordId")
  .put(
    //修改繁殖紀錄
    validateObjectId,
    isLoggedIn,
    verifyEditPermission,
    validBreedingRecord,
    catchAsync(breedingRecords.updateBreedingRecord)
  )
  .delete(
    //刪除繁殖紀錄
    validateObjectId,
    isLoggedIn,
    verifyEditPermission,
    catchAsync(breedingRecords.deleteBreedingRecord)
  );

//編輯繁殖紀錄表單
router.get(
  "/:breedingRecordId/edit",
  validateObjectId,
  isLoggedIn,
  verifyEditPermission,
  validBreedingRecord,
  catchAsync(breedingRecords.renderEditForm)
);

module.exports = router;
