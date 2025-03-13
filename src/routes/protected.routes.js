const express = require("express");
const { authMiddleware, authorizeRoles } = require("../middlewares/users/auth.middleware");

const router = express.Router();

router.get("/admin", authMiddleware, authorizeRoles("Admin"), (req, res) => {
  res.json({ success: true, message: "Halo Admin! Ini adalah halaman admin." });
});

router.get("/vendor-owner", authMiddleware, authorizeRoles("Vendor Owner"), (req, res) => {
  res.json({ success: true, message: "Halo Vendor! Ini adalah halaman vendor." });
});

router.get("/vendor-operator", authMiddleware, authorizeRoles("Vendor Operator"), (req, res) => {
  res.json({ success: true, message: "Halo Vendor! Ini adalah halaman vendor." });
});

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
