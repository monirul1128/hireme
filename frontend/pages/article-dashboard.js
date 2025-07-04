// Article Dashboard Management System
class ArticleDashboard {
    constructor() {
        this.articles = JSON.parse(localStorage.getItem('dashboardArticles')) || [];
        this.currentEditId = null;
        this.tags = [];
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.authToken = localStorage.getItem('authToken');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.setupTagsInput();
        this.renderArticlesList();
        this.loadArticlesFromAPI();
    }

    // Load articles from API
    async loadArticlesFromAPI() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/articles/admin/all`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Merge API articles with local articles
                    this.articles = [...this.articles, ...data.data];
                    this.renderArticlesList();
                }
            }
        } catch (error) {
            console.error('Error loading articles from API:', error);
        }
    }

    // API helper methods
    async makeApiRequest(endpoint, method = 'GET', data = null) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        const config = {
            method,
            headers
        };

        if (data) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, config);
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Login method
    async login(email, password) {
        try {
            const response = await this.makeApiRequest('/auth/login', 'POST', {
                email,
                password
            });

            if (response.success) {
                this.authToken = response.token;
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                return true;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.authToken;
    }

    // Show login modal
    showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'login-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 400px; width: 90%;">
                <h3>Login Required</h3>
                <p>Please login to publish articles to the database.</p>
                <form id="loginForm">
                    <input type="email" id="loginEmail" placeholder="Email" required style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;">
                    <input type="password" id="loginPassword" placeholder="Password" required style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;">
                    <button type="submit" style="background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin-right: 10px;">Login</button>
                    <button type="button" onclick="this.closest('.login-modal').remove()" style="background: #666; color: white; padding: 10px 20px; border: none; border-radius: 5px;">Cancel</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle login form submission
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (result.success) {
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    modal.remove();
                    this.showMessage('Login successful!', 'success');
                    this.publishArticleToAPI(this.getFormData());
                } else {
                    this.showMessage('Login failed: ' + result.message, 'error');
                }
            } catch (error) {
                this.showMessage('Login failed: ' + error.message, 'error');
            }
        });
    }

    setupEventListeners() {
        const form = document.getElementById('articleForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.publishArticle();
            });
        }

        // Auto-generate slug from title
        const titleInput = document.getElementById('articleTitle');
        if (titleInput) {
            titleInput.addEventListener('input', () => {
                this.generateSlug();
            });
        }

        // Auto-generate excerpt from content
        const contentInput = document.getElementById('articleContent');
        if (contentInput) {
            contentInput.addEventListener('input', () => {
                this.generateExcerpt();
            });
        }
    }

    setupTagsInput() {
        const tagInput = document.getElementById('tagInput');
        if (tagInput) {
            tagInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addTag();
                }
            });
        }
    }

    setDefaultDate() {
        const dateInput = document.getElementById('articleDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    generateSlug() {
        const title = document.getElementById('articleTitle').value;
        const slugInput = document.getElementById('articleSlug');
        if (slugInput && title) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            slugInput.value = slug;
        }
    }

    generateExcerpt() {
        const content = document.getElementById('articleContent').value;
        const excerptInput = document.getElementById('articleExcerpt');
        if (excerptInput && content && !excerptInput.value) {
            const excerpt = content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
            excerptInput.value = excerpt;
        }
    }

    addTag() {
        const tagInput = document.getElementById('tagInput');
        const tag = tagInput.value.trim();
        
        if (tag && !this.tags.includes(tag)) {
            this.tags.push(tag);
            this.renderTags();
            tagInput.value = '';
        }
    }

    removeTag(tagToRemove) {
        this.tags = this.tags.filter(tag => tag !== tagToRemove);
        this.renderTags();
    }

    renderTags() {
        const container = document.getElementById('tagsContainer');
        if (!container) return;

        container.innerHTML = this.tags.map(tag => `
            <span class="tag">
                ${tag}
                <span class="tag-remove" onclick="dashboard.removeTag('${tag}')">&times;</span>
            </span>
        `).join('') + '<input type="text" class="tag-input" id="tagInput" placeholder="Add tag and press Enter">';

        // Re-setup the tag input event listener
        const tagInput = document.getElementById('tagInput');
        if (tagInput) {
            tagInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addTag();
                }
            });
        }
    }

    showTab(tabName) {
        // Hide all tabs
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.classList.remove('active'));

        // Remove active class from all nav tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => tab.classList.remove('active'));

        // Show selected tab
        const selectedTab = document.getElementById(tabName + '-tab');
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Add active class to clicked nav tab
        event.target.classList.add('active');

        // If switching to manage tab, refresh the articles list
        if (tabName === 'manage') {
            this.renderArticlesList();
        }
    }

    togglePreview() {
        const previewContent = document.getElementById('previewContent');
        const isVisible = previewContent.style.display !== 'none';
        
        if (isVisible) {
            previewContent.style.display = 'none';
        } else {
            this.generatePreview();
            previewContent.style.display = 'block';
        }
    }

    generatePreview() {
        const title = document.getElementById('articleTitle').value || 'Article Title';
        const excerpt = document.getElementById('articleExcerpt').value || 'Article excerpt...';
        const content = document.getElementById('articleContent').value || 'Article content...';
        const category = document.getElementById('articleCategory').value || 'Category';
        const date = document.getElementById('articleDate').value || new Date().toISOString().split('T')[0];

        const previewContent = document.getElementById('previewContent');
        previewContent.innerHTML = `
            <div style="max-width: 100%;">
                <h2 style="color: #2c3e50; margin-bottom: 10px;">${title}</h2>
                <div style="display: flex; gap: 15px; margin-bottom: 15px; font-size: 0.9rem; color: #666;">
                    <span><strong>Category:</strong> ${category}</span>
                    <span><strong>Date:</strong> ${date}</span>
                </div>
                <p style="color: #555; margin-bottom: 20px; font-style: italic;">${excerpt}</p>
                <div style="border-top: 1px solid #eee; padding-top: 20px;">
                    ${content}
                </div>
                ${this.tags.length > 0 ? `
                    <div style="margin-top: 20px;">
                        <strong>Tags:</strong> ${this.tags.map(tag => `<span style="background: #667eea; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; margin-right: 5px;">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    saveAsDraft() {
        const formData = this.getFormData();
        formData.status = 'draft';
        formData.id = this.currentEditId || Date.now();
        
        if (this.currentEditId) {
            const index = this.articles.findIndex(a => a.id === this.currentEditId);
            if (index !== -1) {
                this.articles[index] = formData;
            }
        } else {
            this.articles.push(formData);
        }

        localStorage.setItem('dashboardArticles', JSON.stringify(this.articles));
        this.showMessage('Article saved as draft!', 'success');
        this.resetForm();
        this.renderArticlesList();
    }

    generateHTML() {
        const formData = this.getFormData();
        if (!formData.title || !formData.content) {
            this.showMessage('Please fill in title and content before generating HTML', 'error');
            return;
        }

        const htmlContent = this.createHTMLPage(formData);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.slug || 'article'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('HTML file generated successfully!', 'success');
    }

    createHTMLPage(article) {
        return `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title}</title>
    <meta name="description" content="${article.excerpt}">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        .meta { color: #666; margin-bottom: 30px; }
        .content { line-height: 1.8; }
        .tags { margin-top: 30px; }
        .tag { background: #3498db; color: white; padding: 5px 10px; border-radius: 15px; margin-right: 10px; font-size: 0.9rem; }
        .back-link { margin-top: 30px; }
        .back-link a { color: #3498db; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${article.title}</h1>
        <div class="meta">
            <strong>Category:</strong> ${article.category} | 
            <strong>Date:</strong> ${article.date} | 
            <strong>Author:</strong> ${article.author || 'Monirul Islam'}
        </div>
        <div class="content">
            ${article.content}
        </div>
        ${article.tags && article.tags.length > 0 ? `
            <div class="tags">
                <strong>Tags:</strong> ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        ` : ''}
        <div class="back-link">
            <a href="javascript:history.back()">← Back to Articles</a>
        </div>
    </div>
</body>
</html>`;
    }

    async publishArticle() {
        const formData = this.getFormData();
        
        // Validate required fields
        if (!formData.title || !formData.content || !formData.category) {
            this.showMessage('Please fill in all required fields (title, content, category)', 'error');
            return;
        }

        // Option 1: Skip login and publish directly (for development/testing)
        const skipLogin = true; // Set to false to require login
        
        if (skipLogin) {
            // Publish directly without authentication
            await this.publishArticleDirectly(formData);
        } else {
            // Check if user is authenticated
            if (!this.isAuthenticated()) {
                this.showLoginModal();
                return;
            }
            // Publish to API with authentication
            await this.publishArticleToAPI(formData);
        }
    }

    // New method for direct publishing without authentication
    async publishArticleDirectly(formData) {
        try {
            // Prepare article data
            const articleData = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                category: formData.category,
                author: formData.author || 'Monirul Islam',
                date: formData.date,
                status: 'published',
                featured: formData.featured || false,
                image: formData.image || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
                slug: formData.slug,
                tags: formData.tags,
                readTime: parseInt(formData.readTime) || 5,
                seo: {
                    description: formData.excerpt,
                    keywords: formData.tags ? formData.tags.join(', ') : ''
                }
            };

            // Try to send to API (without authentication)
            try {
                const response = await fetch('http://localhost:5000/api/articles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(articleData)
                });

                const result = await response.json();

                if (result.success) {
                    // Successfully saved to database
                    this.showMessage('Article published successfully to database!', 'success');
                } else {
                    // API failed, save to localStorage as fallback
                    this.saveToLocalStorage(formData);
                    this.showMessage('Article saved locally (API unavailable)', 'warning');
                }
            } catch (error) {
                // API error, save to localStorage as fallback
                this.saveToLocalStorage(formData);
                this.showMessage('Article saved locally (API unavailable)', 'warning');
            }

            // Always update local storage and UI
            this.updateLocalStorage(formData);
            this.resetForm();
            this.renderArticlesList();

        } catch (error) {
            console.error('Error publishing article:', error);
            this.showMessage('Failed to publish article: ' + error.message, 'error');
        }
    }

    // Save to localStorage as fallback
    saveToLocalStorage(formData) {
        const localArticle = {
            ...formData,
            id: this.currentEditId || Date.now(),
            status: 'published',
            publishedAt: new Date().toISOString()
        };

        if (this.currentEditId) {
            const index = this.articles.findIndex(a => a.id === this.currentEditId);
            if (index !== -1) {
                this.articles[index] = localArticle;
            }
        } else {
            this.articles.push(localArticle);
        }

        localStorage.setItem('dashboardArticles', JSON.stringify(this.articles));
        this.addToMainArticles(localArticle);
    }

    // Update local storage and UI
    updateLocalStorage(formData) {
        const localArticle = {
            ...formData,
            id: this.currentEditId || Date.now(),
            status: 'published',
            publishedAt: new Date().toISOString()
        };

        if (this.currentEditId) {
            const index = this.articles.findIndex(a => a.id === this.currentEditId);
            if (index !== -1) {
                this.articles[index] = localArticle;
            }
        } else {
            this.articles.push(localArticle);
        }

        localStorage.setItem('dashboardArticles', JSON.stringify(this.articles));
        this.addToMainArticles(localArticle);
    }

    async publishArticleToAPI(formData) {
        try {
            // Prepare article data for API
            const articleData = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                category: formData.category,
                author: formData.author || 'Monirul Islam',
                date: formData.date,
                status: 'published',
                featured: formData.featured || false,
                image: formData.image || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
                slug: formData.slug,
                tags: formData.tags,
                readTime: parseInt(formData.readTime) || 5,
                seo: {
                    description: formData.excerpt,
                    keywords: formData.tags ? formData.tags.join(', ') : ''
                }
            };

            // Send to API
            const response = await fetch('http://localhost:5000/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify(articleData)
            });

            const result = await response.json();

            if (result.success) {
                // Add to local storage as well
                const localArticle = {
                    ...formData,
                    id: result.data._id || Date.now(),
                    status: 'published',
                    publishedAt: new Date().toISOString()
                };

                if (this.currentEditId) {
                    const index = this.articles.findIndex(a => a.id === this.currentEditId);
                    if (index !== -1) {
                        this.articles[index] = localArticle;
                    }
                } else {
                    this.articles.push(localArticle);
                }

                localStorage.setItem('dashboardArticles', JSON.stringify(this.articles));
                
                // Add to main articles list (for the blog section)
                this.addToMainArticles(localArticle);
                
                this.showMessage('Article published successfully to database!', 'success');
                this.resetForm();
                this.renderArticlesList();
            } else {
                throw new Error(result.message || 'Failed to publish article');
            }
        } catch (error) {
            console.error('Error publishing article:', error);
            this.showMessage('Failed to publish article: ' + error.message, 'error');
        }
    }

    addToMainArticles(article) {
        // Get existing articles from localStorage
        let mainArticles = JSON.parse(localStorage.getItem('articles')) || [];
        
        // Create article object for main blog
        const mainArticle = {
            id: article.id,
            title: article.title,
            excerpt: article.excerpt,
            category: article.category,
            date: article.date,
            tags: article.tags,
            icon: this.getCategoryIcon(article.category),
            url: article.slug ? `${article.slug}.html` : `article-${article.id}.html`,
            featured: article.featured
        };
        
        // Add to main articles
        mainArticles.push(mainArticle);
        localStorage.setItem('articles', JSON.stringify(mainArticles));
    }

    getCategoryIcon(category) {
        const iconMap = {
            'ব্র্যান্ডিং': 'fas fa-palette',
            'WordPress': 'fab fa-wordpress',
            'ওয়েব ডিজাইন': 'fas fa-paint-brush',
            'ডেভেলপমেন্ট': 'fas fa-code',
            'SEO': 'fas fa-search',
            'ল্যান্ডিং পেজ': 'fas fa-rocket',
            'ডিজাইন': 'fas fa-palette',
            'মার্কেটিং': 'fas fa-bullhorn'
        };
        return iconMap[category] || 'fas fa-file-alt';
    }

    getFormData() {
        return {
            title: document.getElementById('articleTitle').value,
            excerpt: document.getElementById('articleExcerpt').value,
            category: document.getElementById('articleCategory').value,
            date: document.getElementById('articleDate').value,
            author: document.getElementById('articleAuthor').value,
            readTime: document.getElementById('readTime').value,
            image: document.getElementById('articleImage').value,
            slug: document.getElementById('articleSlug').value,
            content: document.getElementById('articleContent').value,
            featured: document.getElementById('articleFeatured').checked,
            tags: this.tags
        };
    }

    renderArticlesList() {
        const articlesList = document.getElementById('articlesList');
        if (!articlesList) return;

        if (this.articles.length === 0) {
            articlesList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No articles found. Create your first article!</p>';
            return;
        }

        articlesList.innerHTML = this.articles.map(article => this.createArticleItem(article)).join('');
    }

    createArticleItem(article) {
        const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="article-item" data-id="${article.id}">
                <div class="article-header">
                    <div>
                        <h4 class="article-title">${article.title}</h4>
                        <div class="article-meta">
                            <span>${article.category}</span>
                            <span>${formattedDate}</span>
                            <span class="article-status ${article.status === 'published' ? 'status-published' : 'status-draft'}">
                                ${article.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                            ${article.featured ? '<span style="color: #e74c3c; font-weight: bold;">Featured</span>' : ''}
                        </div>
                    </div>
                </div>
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">${article.excerpt.substring(0, 100)}...</p>
                <div class="article-actions">
                    <button class="action-btn btn-edit" onclick="dashboard.editArticle('${article.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn btn-delete" onclick="dashboard.deleteArticle('${article.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button class="action-btn btn-view" onclick="dashboard.previewArticle('${article.id}')">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                </div>
            </div>
        `;
    }

    editArticle(id) {
        const article = this.articles.find(a => a.id === id);
        if (!article) return;

        this.currentEditId = id;
        this.tags = article.tags || [];
        
        // Fill form with article data
        document.getElementById('articleTitle').value = article.title || '';
        document.getElementById('articleExcerpt').value = article.excerpt || '';
        document.getElementById('articleCategory').value = article.category || '';
        document.getElementById('articleDate').value = article.date || '';
        document.getElementById('articleAuthor').value = article.author || '';
        document.getElementById('readTime').value = article.readTime || '';
        document.getElementById('articleImage').value = article.image || '';
        document.getElementById('articleSlug').value = article.slug || '';
        document.getElementById('articleContent').value = article.content || '';
        document.getElementById('articleFeatured').checked = article.featured || false;
        
        this.renderTags();
        
        // Switch to create tab
        this.showTab('create');
    }

    deleteArticle(id) {
        if (confirm('Are you sure you want to delete this article?')) {
            this.articles = this.articles.filter(a => a.id !== id);
            localStorage.setItem('dashboardArticles', JSON.stringify(this.articles));
            this.renderArticlesList();
            this.showMessage('Article deleted successfully!', 'success');
        }
    }

    previewArticle(id) {
        const article = this.articles.find(a => a.id === id);
        if (!article) return;

        const fullPreviewContent = document.getElementById('fullPreviewContent');
        fullPreviewContent.innerHTML = `
            <div style="max-width: 100%;">
                <h2 style="color: #2c3e50; margin-bottom: 10px;">${article.title}</h2>
                <div style="display: flex; gap: 15px; margin-bottom: 15px; font-size: 0.9rem; color: #666;">
                    <span><strong>Category:</strong> ${article.category}</span>
                    <span><strong>Date:</strong> ${article.date}</span>
                    <span><strong>Status:</strong> ${article.status}</span>
                </div>
                <p style="color: #555; margin-bottom: 20px; font-style: italic;">${article.excerpt}</p>
                <div style="border-top: 1px solid #eee; padding-top: 20px;">
                    ${article.content}
                </div>
                ${article.tags && article.tags.length > 0 ? `
                    <div style="margin-top: 20px;">
                        <strong>Tags:</strong> ${article.tags.map(tag => `<span style="background: #667eea; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; margin-right: 5px;">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        this.showTab('preview');
    }

    resetForm() {
        document.getElementById('articleForm').reset();
        this.currentEditId = null;
        this.tags = [];
        this.renderTags();
        this.setDefaultDate();
    }

    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
function showTab(tabName) {
    dashboard.showTab(tabName);
}

function togglePreview() {
    dashboard.togglePreview();
}

function saveAsDraft() {
    dashboard.saveAsDraft();
}

function generateHTML() {
    dashboard.generateHTML();
}

function resetForm() {
    dashboard.resetForm();
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', function() {
    dashboard = new ArticleDashboard();
});
