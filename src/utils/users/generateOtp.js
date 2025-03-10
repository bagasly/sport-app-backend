const nodemailer = require("nodemailer");

exports.generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (phone, otp) => {
  console.log(`Mengirim OTP ${otp} ke nomor ${phone}`);
};
