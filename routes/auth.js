const express = require("express");
const { register, login, getMe, logout } = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
