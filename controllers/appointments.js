const Appointment = require("../models/Appointment");
const Hospital = require("../models/Hospital");

//@desc Get all appointments
//@route Get /api/v1/appointments
//@access Public
exports.getAppointments = async (req, res, next) => {
  let query;
  if (req.user.role !== "admin") {
    query = Appointment.find({ user: req.user.id }).populate({
      path: "hospital",
      select: "name province tel",
    });
  } else {
    query = Appointment.find().populate({
      path: "hospital",
      select: "name province tel",
    });
  }
  try {
    const appointments = await query;
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "Cannot find Appointment" });
  }
};
//@desc Get single appointment
//@route Get /api/v1/appointments/:id
//@access Public
exports.getAppointment = async (req, res, next) => {
  try {
    const appointments = await Appointment.findById(req.params.id).populate({
      path: "hospital",
      select: "name description tel",
    });
    if (!appointments) {
      return res.status(404).json({
        success: false,
        msg: ` No appointment with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "Cannot find Appointment" });
  }
};
//@desc Add appointment
//@route POST /api/v1/hospitals/:hospitalId/appointment
//@access Public
exports.addAppointment = async (req, res, next) => {
  try {
    req.body.hospital = req.params.hospitalId;
    const hospital = await Hospital.findById(req.params.hospitalId);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        msg: ` No Hospital with the id of ${req.params.hospitalId}`,
      });
    }

    //add user Id to req.body
    req.body.user = req.user.id;

    //check for existed appointment
    const existedAppointment = await Appointment.find({ user: req.user.id });
    if (existedAppointment.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        msg: ` the user with ID ${req.user.id} has already made 3  appointmnets`,
      });
    }

    const appointment = await Appointment.create(req.body);
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "Cannot create Appointment" });
  }
};

//@desc Update appointment
//@route PUT /api/v1/appointments/:id
//@access Private
exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        msg: ` No Appointment with the id of ${req.params.id}`,
      });
    }

    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        msg: ` User ${req.user.id} is not autgorized to update this appointment`,
      });
    }
    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "Cannot update Appointment" });
  }
};

//@desc Delete appointment
//@route DELETE /api/v1/appointments/:id
//@access Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        msg: ` No Appointment with the id of ${req.params.id}`,
      });
    }
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        msg: ` User ${req.user.id} is not autgorized to delete this appointment`,
      });
    }
    await appointment.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "Cannot delete Appointment" });
  }
};
