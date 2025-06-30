const fs = require('fs');
const path = require('path');

class JsonDatabase {
    constructor() {
        this.dbPath = path.join(__dirname, '../data');
        this.articlesFile = path.join(this.dbPath, 'articles.json');
        this.usersFile = path.join(this.dbPath, 'users.json');
        this.init();
    }

    init() {
        // Create data directory if it doesn't exist
        if (!fs.existsSync(this.dbPath)) {
            fs.mkdirSync(this.dbPath, { recursive: true });
        }

        // Initialize articles.json if it doesn't exist
        if (!fs.existsSync(this.articlesFile)) {
            fs.writeFileSync(this.articlesFile, JSON.stringify([], null, 2));
        }

        // Initialize users.json if it doesn't exist
        if (!fs.existsSync(this.usersFile)) {
            const defaultUsers = [
                {
                    _id: '1',
                    name: 'Monirul Islam',
                    email: 'admin@webcraftstudio.com',
                    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
                    role: 'admin',
                    createdAt: new Date().toISOString()
                }
            ];
            fs.writeFileSync(this.usersFile, JSON.stringify(defaultUsers, null, 2));
        }
    }

    // Article methods
    async getAllArticles(query = {}) {
        try {
            const articles = JSON.parse(fs.readFileSync(this.articlesFile, 'utf8'));
            let filteredArticles = articles;

            // Filter by status
            if (query.status) {
                filteredArticles = filteredArticles.filter(article => article.status === query.status);
            }

            // Filter by category
            if (query.category) {
                filteredArticles = filteredArticles.filter(article => article.category === query.category);
            }

            // Search functionality
            if (query.search) {
                const searchTerm = query.search.toLowerCase();
                filteredArticles = filteredArticles.filter(article => 
                    article.title.toLowerCase().includes(searchTerm) ||
                    article.content.toLowerCase().includes(searchTerm) ||
                    article.excerpt.toLowerCase().includes(searchTerm)
                );
            }

            // Sort
            if (query.sort) {
                switch (query.sort) {
                    case 'newest':
                        filteredArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
                        break;
                    case 'oldest':
                        filteredArticles.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
                        break;
                    case 'title':
                        filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
                        break;
                    case 'popular':
                        filteredArticles.sort((a, b) => (b.views || 0) - (a.views || 0));
                        break;
                }
            } else {
                // Default sort by newest
                filteredArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
            }

            // Pagination
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const skip = (page - 1) * limit;
            const paginatedArticles = filteredArticles.slice(skip, skip + limit);

            return {
                success: true,
                count: paginatedArticles.length,
                total: filteredArticles.length,
                totalPages: Math.ceil(filteredArticles.length / limit),
                currentPage: page,
                data: paginatedArticles
            };
        } catch (error) {
            console.error('Error reading articles:', error);
            return { success: false, error: error.message };
        }
    }

    async getFeaturedArticles() {
        try {
            const articles = JSON.parse(fs.readFileSync(this.articlesFile, 'utf8'));
            const featuredArticles = articles
                .filter(article => article.featured && article.status === 'published')
                .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
                .slice(0, 6);

            return {
                success: true,
                count: featuredArticles.length,
                data: featuredArticles
            };
        } catch (error) {
            console.error('Error reading featured articles:', error);
            return { success: false, error: error.message };
        }
    }

    async getArticleBySlug(slug) {
        try {
            const articles = JSON.parse(fs.readFileSync(this.articlesFile, 'utf8'));
            const article = articles.find(a => a.slug === slug && a.status === 'published');
            
            if (article) {
                // Increment views
                article.views = (article.views || 0) + 1;
                this.saveArticles(articles);
                
                return { success: true, data: article };
            } else {
                return { success: false, message: 'Article not found' };
            }
        } catch (error) {
            console.error('Error reading article:', error);
            return { success: false, error: error.message };
        }
    }

    async getArticleById(id) {
        try {
            const articles = JSON.parse(fs.readFileSync(this.articlesFile, 'utf8'));
            const article = articles.find(a => a._id === id);
            
            if (article) {
                if (article.status === 'published') {
                    // Increment views
                    article.views = (article.views || 0) + 1;
                    this.saveArticles(articles);
                }
                
                return { success: true, data: article };
            } else {
                return { success: false, message: 'Article not found' };
            }
        } catch (error) {
            console.error('Error reading article:', error);
            return { success: false, error: error.message };
        }
    }

    async createArticle(articleData) {
        try {
            const articles = JSON.parse(fs.readFileSync(this.articlesFile, 'utf8'));
            
            const newArticle = {
                _id: Date.now().toString(),
                ...articleData,
                createdAt: new Date().toISOString(),
                publishedAt: articleData.status === 'published' ? new Date().toISOString() : null,
                views: 0,
                likes: 0
            };

            articles.push(newArticle);
            this.saveArticles(articles);

            return { success: true, data: newArticle };
        } catch (error) {
            console.error('Error creating article:', error);
            return { success: false, error: error.message };
        }
    }

    async updateArticle(id, updateData) {
        try {
            const articles = JSON.parse(fs.readFileSync(this.articlesFile, 'utf8'));
            const index = articles.findIndex(a => a._id === id);
            
            if (index !== -1) {
                articles[index] = {
                    ...articles[index],
                    ...updateData,
                    updatedAt: new Date().toISOString()
                };

                if (updateData.status === 'published' && !articles[index].publishedAt) {
                    articles[index].publishedAt = new Date().toISOString();
                }

                this.saveArticles(articles);
                return { success: true, data: articles[index] };
            } else {
                return { success: false, message: 'Article not found' };
            }
        } catch (error) {
            console.error('Error updating article:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteArticle(id) {
        try {
            const articles = JSON.parse(fs.readFileSync(this.articlesFile, 'utf8'));
            const index = articles.findIndex(a => a._id === id);
            
            if (index !== -1) {
                articles.splice(index, 1);
                this.saveArticles(articles);
                return { success: true, message: 'Article deleted successfully' };
            } else {
                return { success: false, message: 'Article not found' };
            }
        } catch (error) {
            console.error('Error deleting article:', error);
            return { success: false, error: error.message };
        }
    }

    async getCategories() {
        try {
            const articles = JSON.parse(fs.readFileSync(this.articlesFile, 'utf8'));
            const categories = [...new Set(articles
                .filter(article => article.status === 'published')
                .map(article => article.category))];
            
            return { success: true, data: categories };
        } catch (error) {
            console.error('Error reading categories:', error);
            return { success: false, error: error.message };
        }
    }

    // Helper method to save articles
    saveArticles(articles) {
        fs.writeFileSync(this.articlesFile, JSON.stringify(articles, null, 2));
    }

    // User methods
    async findUserByEmail(email) {
        try {
            const users = JSON.parse(fs.readFileSync(this.usersFile, 'utf8'));
            const user = users.find(u => u.email === email);
            return user || null;
        } catch (error) {
            console.error('Error reading users:', error);
            return null;
        }
    }

    async findUserById(id) {
        try {
            const users = JSON.parse(fs.readFileSync(this.usersFile, 'utf8'));
            const user = users.find(u => u._id === id);
            return user || null;
        } catch (error) {
            console.error('Error reading users:', error);
            return null;
        }
    }
}

module.exports = new JsonDatabase(); 