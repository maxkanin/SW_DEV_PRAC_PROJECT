const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    address: {
      type: String,
      required: [true, "Please Add an address"],
    },
    district: {
      type: String,
      required: [true, "Please Add a district"],
    },
    postalcode: {
      type: String,
      required: [true, "Please Add a postalcode"],
      maxlength: [5, "Postalcode can not be more than 5 digits"],
    },
    tel: {
      type: String,
    },
    region: {
      type: String,
      required: [true, "Please Add a region"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//Casscade delete appointment when a hospital is delete
HospitalSchema.pre("remove", async function (next) {
  console.log(`Appointment being remove from hospital ${this._id}`);
  await this.model("Appointment").deleteMany({ hospital: this._id });
  next();
});

HospitalSchema.virtual("appointments", {
  ref: "Appointment",
  localField: "_id",
  foreignField: "hospital",
  justOne: false,
});
module.exports = mongoose.model("Hospital", HospitalSchema);
