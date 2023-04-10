const User = require("../models/User");

//@desc Register user
//@route POST /api/v1/auth/register
//@access Public

exports.register = async (req, res, next) => {
  try {
    const { name, telephone, email, password, role } = req.body;
    const user = await User.create({ name, email, telephone, password, role });
    // const token = user.getSignedJwtToken();
    // res.status(200).json({ success: true, token });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
    console.log(err);
  }
};
//@desc Login user
//@route POST /api/v1/auth/login
//@access Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide an email and password" });
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({ success: false, msg: "Invalid credentials" });
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, msg: "Invalid credentials" });
  }
  //Create token
  // const token = user.getSignedJwtToken();
  // return res.status(200).json({ success: true, token });
  sendTokenResponse(user, 200, res);
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
//@desc Log user out / clear cookie
//@route GET /api/v1/auth/logout
//@access Private
exports.logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .clearCookie("token")
      .json({ success: true, message: "successfully logout" });
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err);
  }
};
//@desc Register user
//@route POST /api/v1/auth/register
//@access Public
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};
