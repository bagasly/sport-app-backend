const axios = require("axios");
const redisClient = require("../../config/redis");
require("dotenv").config(); 

const ZENZIVA_URL = process.env.ZENZIVA_URL;
const ZENZIVA_USERKEY = process.env.ZENZIVA_USERKEY;
const ZENZIVA_PASSKEY = process.env.ZENZIVA_PASSKEY;

exports.generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();


exports.sendOtp = async (phone) => {
  const formattedPhone = phone.startsWith("+") ? phone : `+62${phone.slice(1)}`;

  // Ambil OTP dari Redis, jika tidak ada, buat baru
  let otp = await redisClient.get(`otp:${phone}`);
  if (!otp) {
    console.log("OTP belum ada di Redis, membuat OTP baru...");
    otp = generateOtp();
    await redisClient.setEx(`otp:${phone}`, 300, otp); // Simpan di Redis
  } else {
    console.log(`Menggunakan OTP yang sudah ada: ${otp}`);
  }

  try {
    const payload = {
      userkey: ZENZIVA_USERKEY,
      passkey: ZENZIVA_PASSKEY,
      to: formattedPhone,
      brand: "Athletix",
      otp: otp,
    };

    console.log("Mengirim OTP ke Zenziva:", payload);

    const response = await axios.post(ZENZIVA_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Response dari Zenziva:", response.data);

    if (!response.data || response.data.status !== "1") {
      throw new Error(`Gagal mengirim OTP via SMS: ${JSON.stringify(response.data)}`);
    }

    console.log(`OTP ${otp} telah dikirim ke ${formattedPhone}`);
    return otp;
  } catch (error) {
    console.error("Gagal mengirim OTP:", error.response?.data || error.message);
    throw new Error("Gagal mengirim OTP, silakan coba lagi.");
  }
};
