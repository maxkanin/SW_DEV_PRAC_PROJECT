const mongoose = require("mongoose");

const CampgroundSchema = new mongoose.Schema(
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
      required: [true, "Please add a telephone number"],
      match: [
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        "Please add a valid telephone",
      ],
    },
    region: {
      type: String,
      required: [true, "Please Add a region"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//Casscade delete appointment when a campground is delete
CampgroundSchema.pre("remove", async function (next) {
  console.log(`Booking being remove from Campground ${this._id}`);
  await this.model("Booking").deleteMany({ campground: this._id });
  next();
});

CampgroundSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "campground",
  justOne: false,
});
module.exports = mongoose.model("Campground", CampgroundSchema);
