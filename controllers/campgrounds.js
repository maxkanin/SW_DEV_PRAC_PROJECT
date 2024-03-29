const Campground = require("../models/Campground");
//@desc Get all campgrounds
//@route Get /api/v1/campgrounds
//@access Public

exports.getCampgrounds = async (req, res, next) => {
  try {
    let query;

    //copy req.query
    const reqQuery = { ...req.query };

    //Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    //loop over remove fields and delete them from reqQuery
    removeFields.forEach((params) => delete reqQuery[params]);
    console.log(reqQuery);
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    console.log(queryStr);
    query = Campground.find(JSON.parse(queryStr)).populate("bookings");

    //Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }
    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    console.log(page, limit);

    const startIndex = (page - 1) * limit;
    console.log(startIndex);
    const endIndex = page * limit;
    const total = await Campground.countDocuments();
    query = query.skip(startIndex).limit(limit);

    const campgrounds = await query;
    //Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    res.status(200).json({
      success: true,
      count: campgrounds.length,
      pagination,
      data: campgrounds,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

//@desc Get single campgrounds
//@route Get /api/v1/campgrounds/:id
//@access Public

exports.getCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: campground });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Create a campground
//@route POST /api/v1/campgrounds
//@access Private

exports.createCampground = async (req, res, next) => {
  try {
    const campground = await Campground.create(req.body);
    res.status(201).json({ success: true, data: campground });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//@desc Update single campgrounds
//@route Put /api/v1/campgrounds/:id
//@access Private

exports.updateCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!campground) {
      return res.status(400).json({ success: false });
    }
    return res.status(200).json({ success: true, data: campground });
  } catch (err) {
    return res.status(400).json({ success: false });
  }
};

//@desc Delete single campgrounds
//@route DELETE /api/v1/campgrounds/:id
//@access Private

exports.deleteCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      return res.status(400).json({ success: false });
    }
    campground.remove();
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return res.status(400).json({ success: false });
  }
};
