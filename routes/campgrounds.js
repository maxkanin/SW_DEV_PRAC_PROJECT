const express = require("express");
const {
  getCampgrounds,
  getCampground,
  createCampground,
  updateCampground,
  deleteCampground,
} = require("../controllers/campgrounds");
const { protect, authorize } = require("../middleware/auth");

const bookingRouter = require("./bookings");
const router = express.Router();
// Re-route into other resource router
router.use("/:campgroundId/bookings/", bookingRouter);
router
  .route("/")
  .get(getCampgrounds)
  .post(protect, authorize("admin"), createCampground);
router
  .route("/:id")
  .get(getCampground)
  .put(protect, authorize("admin"), updateCampground)
  .delete(protect, authorize("admin"), deleteCampground);

module.exports = router;
