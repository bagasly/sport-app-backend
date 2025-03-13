const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await prisma.article.findMany();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch articles", error: error.message });
    }
};

exports.getArticleById = async (req, res) => {
    try {
        const articleId = parseInt(req.params.id, 10);
        if (isNaN(articleId)) return res.status(400).json({ message: "Invalid article ID" });

        const article = await prisma.article.findUnique({
            where: { id: articleId },
        });

        if (!article) return res.status(404).json({ message: "Article not found" });

        res.json(article);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch article", error: error.message });
    }
};

exports.createArticle = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const newArticle = await prisma.article.create({
            data: { title, content }
        });

        res.status(201).json(newArticle);
    } catch (error) {
        res.status(500).json({ message: "Failed to create article", error: error.message });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        const { title, content } = req.body;
        const articleId = parseInt(req.params.id, 10);

        if (isNaN(articleId)) return res.status(400).json({ message: "Invalid article ID" });

        const article = await prisma.article.findUnique({ where: { id: articleId } });
        if (!article) return res.status(404).json({ message: "Article not found" });

        const updatedArticle = await prisma.article.update({
            where: { id: articleId },
            data: { title, content, updatedAt: new Date() }  // Tambahkan updatedAt
        });

        res.json(updatedArticle);
    } catch (error) {
        res.status(500).json({ message: "Failed to update article", error: error.message });
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        const articleId = parseInt(req.params.id, 10);
        if (isNaN(articleId)) return res.status(400).json({ message: "Invalid article ID" });

        const article = await prisma.article.findUnique({ where: { id: articleId } });

        if (!article) return res.status(404).json({ message: "Article not found" });

        await prisma.article.delete({ where: { id: articleId } });
        res.json({ message: "Article deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete article", error: error.message });
    }
};
