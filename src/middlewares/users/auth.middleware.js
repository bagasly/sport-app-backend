const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET.trim();

// Middleware untuk verifikasi token dari Header Authorization
exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Ambil token dari header

  if (!token) {
    return res.status(401).json({ success: false, message: "Akses ditolak, token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });
    req.user = decoded; // Simpan data user di request
    next(); // Lanjut ke rute berikutnya
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token tidak valid atau sudah kedaluwarsa" });
  }
};

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Akses ditolak, tidak memiliki izin" });
    }
    next();
  };
};