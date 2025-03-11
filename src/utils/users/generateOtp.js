const axios = require("axios");

require("dotenv").config(); // Pastikan dotenv di-load

const ZENZIVA_URL = process.env.ZENZIVA_URL;
const ZENZIVA_USERKEY = process.env.ZENZIVA_USERKEY;
const ZENZIVA_PASSKEY = process.env.ZENZIVA_PASSKEY;

// Fungsi untuk generate OTP
exports.generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Fungsi untuk mengirim OTP melalui Zenziva
exports.sendOtp = async (phone) => {
  const otp = exports.generateOtp();
  const formattedPhone = phone.startsWith("+") ? phone : `+62${phone.slice(1)}`; // Pastikan format nomor benar

  try {
    const response = await axios.post(`${ZENZIVA_URL}/waofficial/api/sendWAOfficial`, {
      userkey: ZENZIVA_USERKEY,
      passkey: ZENZIVA_PASSKEY,
      to: formattedPhone,
      brand: "Kode OTP",
      otp: otp,
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("Response dari Zenziva:", response.data); // Debugging

    if (!response.data || response.data.status !== "1") {
      throw new Error(`Gagal mengirim OTP via SMS: ${JSON.stringify(response.data)}`);
    }

    console.log(`OTP ${otp} telah dikirim ke ${formattedPhone}`);
    return otp;
  } catch (error) {
    console.error("Gagal mengirim OTP. Response dari Zenziva:", error.response?.data || error.message);
    throw new Error("Gagal mengirim OTP, silakan coba lagi.");
  }
};
