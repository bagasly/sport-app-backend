const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");
const { generateOtp, sendOtp } = require("../utils/generateOtp");

exports.register = async (req, res) => {
  try {
    const { fullname, username, email, phone, password, confirmPassword } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otpCode = generateOtp();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

    await prisma.OTP.create({
      data: { phone, code: otpCode, expiresAt: otpExpiry },
    });

    await sendOtp(phone, otpCode); // Simulasi pengiriman OTP

    return res.status(200).json({ message: "OTP telah dikirim ke nomor ponsel Anda" });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

exports.verifyOtpAndCreateUser = async (req, res) => {
  try {
    const { phone, otp, fullname, username, email, password } = req.body;

    const otpRecord = await prisma.OTP.findFirst({
      where: { phone, code: otp },
    });

    if (!otpRecord || new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ message: "OTP tidak valid atau kedaluwarsa" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { fullname, username, email, phone, password: hashedPassword },
    });

    await prisma.OTP.deleteMany({ where: { phone } });

    const token = jwt.generateToken({ id: user.id });

    return res.status(201).json({ message: "Registrasi berhasil", token });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
