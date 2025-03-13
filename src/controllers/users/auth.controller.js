const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("../../utils/users/jwt");
const { sendOtp } = require("../../utils/users/generateOtp");
const { storeOtp, verifyOtp, deleteOtp } = require("../../controllers/users/otp.service");
const e = require("express");

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  try {
    const { fullname, username, email, phone, password, confirmPassword } = req.body;

    if (!fullname || !username || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email tidak valid" });
    }

    const phoneRegex = /^(08|62)\d{10,14}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Nomor ponsel tidak valid" });
    }
    
    const passwordRegex = /^.{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Minimal 8 karakter" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password dan Confirm Password tidak cocok" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ message: "Email telah terdaftar" });

    // Simpan OTP ke Redis
    const otpCode = await storeOtp(phone);

    // Kirim OTP via Zenziva
    await sendOtp(phone, otpCode);

    return res.status(200).json({ message: "OTP telah dikirim ke nomor ponsel Anda" });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};


exports.verifyOtpAndCreateUser = async (req, res) => {
    try {
      const { phone, otp, fullname, username, email, password, confirmPassword } = req.body;
  
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Password dan Confirm Password tidak cocok" });
      }
  
      // Verifikasi OTP dengan Redis
      const isValidOtp = await verifyOtp(phone, otp);
      if (!isValidOtp) {
        return res.status(400).json({ message: "OTP tidak valid atau kadaluarsa" });
      }
  
      const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);
  
      // Simpan user ke database
      const user = await prisma.user.create({
        data: { fullname, username, email, phone, password: hashedPassword },
      });
  
      // Hapus OTP setelah verifikasi sukses
      await deleteOtp(phone);
  
      // Generate JWT token
      const token = jwt.generateToken({ id: user.id, fullname: user.fullname, email: user.email, role: user.role });
  
      return res.status(201).json({ message: "Registrasi berhasil", token });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan", error });
    }
  };
  
exports.login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) return res.status(404).json({ message: "username atau password salah" });
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: "username atau password salah" });
  
      // Generate JWT token
      const token = jwt.generateToken({ id: user.id, fullname: user.fullname, email: user.email, role: user.role });
  
      return res.status(200).json({ message: "Login berhasil", token });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan", error });
    }
  };