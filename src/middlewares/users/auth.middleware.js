exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Ambil token dari header
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token required" });
    }
  
    const decoded = jwt.verifyToken(token);
  
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  
    req.user = decoded; // Simpan user data ke `req.user`
    next();
  };
  