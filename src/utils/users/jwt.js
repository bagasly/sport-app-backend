const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.generateToken = (user) => {
  const payload = {
    id: user.id,
    name: user.fullname,  // Menyimpan nama user
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null; // Mengembalikan null jika token tidak valid atau expired
  }
};
