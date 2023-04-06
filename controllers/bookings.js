const Booking = require("../models/Booking");
const Campground = require("../models/Campground");

//@desc Get all bookings
//@route Get /api/v1/bookings
//@access Public
exports.getBookings = async (req, res, next) => {
  let query;
  if (req.user.role !== "admin") {
    query = Booking.find({ user: req.user.id }).populate({
      path: "campground",
      select: "name address tel",
    });
  } else {
    query = Booking.find().populate({
      path: "campground",
      select: "name address tel",
    });
  }
  try {
    const bookings = await query;
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: "Cannot find Booking" });
  }
};
//@desc Get single booking
//@route Get /api/v1/bookingts/:id
//@access Public
exports.getBooking = async (req, res, next) => {
  try {
    const bookings = await Booking.findById(req.params.id).populate({
      path: "campground",
      select: "name address tel",
    });
    if (!bookings) {
      return res.status(404).json({
        success: false,
        msg: ` No booking with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: "Cannot find Booking" });
  }
};
//@desc Add booking
//@route POST /api/v1/campgrounds/:campgroundId/booking
//@access Public
exports.addBooking = async (req, res, next) => {
  try {
    req.body.campground = req.params.campgroundId;
    const campground = await Campground.findById(req.params.campgroundId);
    if (!campground) {
      return res.status(404).json({
        success: false,
        msg: ` No Campground with the id of ${req.params.campgroundId}`,
      });
    }

    //add user Id to req.body
    req.body.user = req.user.id;

    //check for existed appointment
    const existedBooking = await Booking.find({ user: req.user.id });
    if (existedBooking.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        msg: ` the user with ID ${req.user.id} has already made 3  bookings`,
      });
    }

    const booking = await Booking.create(req.body);
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "Cannot create Booking" });
  }
};

//@desc Update booking
//@route PUT /api/v1/bookings/:id
//@access Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        msg: ` No Booking with the id of ${req.params.id}`,
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        msg: ` User ${req.user.id} is not autgorized to update this booking`,
      });
    }
    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "Cannot update Booking" });
  }
};

//@desc Delete booking
//@route DELETE /api/v1/bookings/:id
//@access Private
exports.deleteBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        msg: ` No Booking with the id of ${req.params.id}`,
      });
    }
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        msg: ` User ${req.user.id} is not autgorized to delete this booking`,
      });
    }
    await booking.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "Cannot delete Booking" });
  }
};
