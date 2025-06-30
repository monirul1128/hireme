const express = require('express');
const router = express.Router();
const db = require('../utils/jsonDatabase');

// Get all published articles (public)
router.get('/', async (req, res) => {
    try {
        const query = { status: 'published' };
        
        // Add other query parameters
        if (req.query.category) query.category = req.query.category;
        if (req.query.search) query.search = req.query.search;
        if (req.query.sort) query.sort = req.query.sort;
        if (req.query.page) query.page = req.query.page;
        if (req.query.limit) query.limit = req.query.limit;

        const result = await db.getAllArticles(query);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json({
                success: false,
                message: 'Error fetching articles',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching articles',
            error: error.message
        });
    }
});

// Get featured articles (public)
router.get('/featured', async (req, res) => {
    try {
        const result = await db.getFeaturedArticles();
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json({
                success: false,
                message: 'Error fetching featured articles',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching featured articles',
            error: error.message
        });
    }
});

// Get article by slug (public)
router.get('/slug/:slug', async (req, res) => {
    try {
        const result = await db.getArticleBySlug(req.params.slug);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                success: false,
                message: result.message || 'Article not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching article',
            error: error.message
        });
    }
});

// Get article by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const result = await db.getArticleById(req.params.id);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                success: false,
                message: result.message || 'Article not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching article',
            error: error.message
        });
    }
});

// Get categories (public)
router.get('/categories/list', async (req, res) => {
    try {
        const result = await db.getCategories();
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json({
                success: false,
                message: 'Error fetching categories',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
});

// Create new article (public for development)
router.post('/', async (req, res) => {
    try {
        const result = await db.createArticle(req.body);
        
        if (result.success) {
            res.status(201).json({
                success: true,
                message: 'Article created successfully',
                data: result.data
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Error creating article',
                error: result.error
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating article',
            error: error.message
        });
    }
});

// Update article (public for development)
router.put('/:id', async (req, res) => {
    try {
        const result = await db.updateArticle(req.params.id, req.body);
        
        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Article updated successfully',
                data: result.data
            });
        } else {
            res.status(404).json({
                success: false,
                message: result.message || 'Article not found'
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating article',
            error: error.message
        });
    }
});

// Delete article (public for development)
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.deleteArticle(req.params.id);
        
        if (result.success) {
            res.status(200).json({
                success: true,
                message: result.message
            });
        } else {
            res.status(404).json({
                success: false,
                message: result.message || 'Article not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting article',
            error: error.message
        });
    }
});

// Get all articles (public for development - includes drafts)
router.get('/admin/all', async (req, res) => {
    try {
        const query = {};
        
        // Add query parameters
        if (req.query.status) query.status = req.query.status;
        if (req.query.category) query.category = req.query.category;
        if (req.query.search) query.search = req.query.search;
        if (req.query.sort) query.sort = req.query.sort;
        if (req.query.page) query.page = req.query.page;
        if (req.query.limit) query.limit = req.query.limit;

        const result = await db.getAllArticles(query);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json({
                success: false,
                message: 'Error fetching articles',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching articles',
            error: error.message
        });
    }
});

module.exports = router; 