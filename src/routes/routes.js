const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOtpAndCreateUser);

module.exports = router;
