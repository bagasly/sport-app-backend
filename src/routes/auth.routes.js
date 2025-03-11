const express = require("express");
const router = express.Router();
const authController = require("../controllers/users/auth.controller");

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOtpAndCreateUser);

module.exports = router;
