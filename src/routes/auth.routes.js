const express = require("express");
const router = express.Router();
const authController = require("../controllers/users/auth.controller");
const articleController = require("../controllers/articles/article");
const { authMiddleware, authorizeRoles } = require('../middlewares/users/auth.middleware'); // Pastikan struktur benar

// Routes untuk autentikasi
router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOtpAndCreateUser);
router.post("/login", authController.login);

// Routes untuk artikel
const articles = express.Router();
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.post('/', authMiddleware, authorizeRoles, articleController.createArticle);
router.put('/:id', authMiddleware, authorizeRoles, articleController.updateArticle);
router.delete('/:id', authMiddleware, authorizeRoles, articleController.deleteArticle);


router.use("/articles", articles)
module.exports = router;
