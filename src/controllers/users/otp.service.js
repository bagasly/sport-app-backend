const redisClient = require("../../config/redis");

const { generateOtp } = require("../../utils/users/generateOtp");

const OTP_EXPIRY = 300; // OTP berlaku selama 5 menit



// Simpan OTP ke Redis
exports.storeOtp = async (phone) => {
  const otp = generateOtp();
  await redisClient.setEx(`otp:${phone}`, OTP_EXPIRY, otp);
  console.log(`OTP untuk ${phone}: ${otp}`); // Debugging, bisa dihapus
  return otp;
};

// Verifikasi OTP dari Redis
exports.verifyOtp = async (phone, otpInput) => {
  const storedOtp = await redisClient.get(`otp:${phone}`);
  if (!storedOtp) return false; // OTP tidak ditemukan atau sudah expired
  return storedOtp === otpInput;
};

// Hapus OTP setelah digunakan
exports.deleteOtp = async (phone) => {
  await redisClient.del(`otp:${phone}`);
};
