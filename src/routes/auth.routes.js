const express = require("express");
const router = express.Router();
const authController = require("../controllers/users/auth.controller");
const authMiddleware = require("../middlewares/users/auth.middleware");

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOtpAndCreateUser);
router.post("/login", authController.login);

module.exports = router;
