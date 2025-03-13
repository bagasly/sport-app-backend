const jwt = require("jsonwebtoken");
require("dotenv").config();

// Pastikan JWT_SECRET ada
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET tidak ditemukan di environment variables!");
}

const jwtSecret = process.env.JWT_SECRET.trim();

exports.generateToken = (user) => {
  const payload = {
    id: user.id,
    name: user.fullname,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000), // Waktu token dibuat
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Expired dalam 24 jam
  };

  return jwt.sign(payload, jwtSecret, { algorithm: "HS256" });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    throw new Error("Token tidak valid atau sudah kedaluwarsa");
  }
};
