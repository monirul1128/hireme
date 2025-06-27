// Admin Panel Management System
class AdminManager {
    constructor() {
        this.articles = JSON.parse(localStorage.getItem('articles')) || [
            {
                id: 1,
                title: "10 Essential WordPress Plugins for Every Website",
                excerpt: "Discover the must-have WordPress plugins that will enhance your website's functionality, security, and performance.",
                category: "WordPress",
                date: "2024-01-15",
                tags: ["WordPress", "Plugins", "SEO"],
                icon: "fas fa-wordpress",
                url: "blog-article.html",
                featured: true
            },
            {
                id: 2,
                title: "Mobile-First Design: Why It's Crucial for SEO",
                excerpt: "Learn why mobile-first design is not just a trend but a necessity for modern websites.",
                category: "Web Design",
                date: "2024-01-12",
                tags: ["Mobile", "SEO", "UX"],
                icon: "fas fa-mobile-alt",
                url: "#",
                featured: false
            }
        ];
        
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.renderArticlesList();
        this.setupEventListeners();
        this.setDefaultDate();
    }

    setupEventListeners() {
        const form = document.getElementById('articleForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveArticle();
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

    renderArticlesList() {
        const articlesList = document.getElementById('articlesList');
        if (!articlesList) return;

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
                <h4>${article.title}</h4>
                <div class="article-meta">
                    <span>${article.category}</span>
                    <span>${formattedDate}</span>
                    ${article.featured ? '<span style="color: #e74c3c; font-weight: bold;">Featured</span>' : ''}
                </div>
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">${article.excerpt.substring(0, 100)}...</p>
                <div class="article-actions">
                    <button class="action-btn edit-btn" onclick="adminManager.editArticle(${article.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="adminManager.deleteArticle(${article.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button class="action-btn preview-btn" onclick="adminManager.previewArticle(${article.id})">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                </div>
            </div>
        `;
    }

    showAddForm() {
        this.currentEditId = null;
        document.getElementById('formTitle').textContent = 'Add New Article';
        document.getElementById('articleForm').reset();
        this.setDefaultDate();
    }

    editArticle(id) {
        const article = this.articles.find(a => a.id === id);
        if (!article) return;

        this.currentEditId = id;
        document.getElementById('formTitle').textContent = 'Edit Article';
        
        // Fill form with article data
        document.getElementById('articleTitle').value = article.title;
        document.getElementById('articleExcerpt').value = article.excerpt;
        document.getElementById('articleCategory').value = article.category;
        document.getElementById('articleDate').value = article.date;
        document.getElementById('articleIcon').value = article.icon;
        document.getElementById('articleUrl').value = article.url || '';
        document.getElementById('articleFeatured').checked = article.featured;
    }

    saveArticle() {
        const formData = {
            title: document.getElementById('articleTitle').value,
            excerpt: document.getElementById('articleExcerpt').value,
            category: document.getElementById('articleCategory').value,
            date: document.getElementById('articleDate').value,
            icon: document.getElementById('articleIcon').value,
            url: document.getElementById('articleUrl').value,
            featured: document.getElementById('articleFeatured').checked,
            tags: this.extractTags()
        };

        if (this.currentEditId) {
            // Update existing article
            const index = this.articles.findIndex(a => a.id === this.currentEditId);
            if (index !== -1) {
                this.articles[index] = { ...this.articles[index], ...formData };
            }
        } else {
            // Add new article
            const newArticle = {
                id: Date.now(),
                ...formData
            };
            this.articles.push(newArticle);
        }

        // Save to localStorage
        localStorage.setItem('articles', JSON.stringify(this.articles));
        
        // Update display
        this.renderArticlesList();
        this.resetForm();
        
        // Show success message
        this.showMessage('Article saved successfully!', 'success');
    }

    extractTags() {
        // For now, return default tags based on category
        const category = document.getElementById('articleCategory').value;
        const tagMap = {
            'WordPress': ['WordPress', 'CMS', 'Development'],
            'Web Design': ['Design', 'UI/UX', 'Creative'],
            'Development': ['Coding', 'Programming', 'Technical'],
            'SEO': ['SEO', 'Marketing', 'Optimization'],
            'Landing Pages': ['Conversion', 'Marketing', 'CRO'],
            'Design': ['Design', 'Visual', 'Creative']
        };
        return tagMap[category] || [category];
    }

    deleteArticle(id) {
        if (confirm('Are you sure you want to delete this article?')) {
            this.articles = this.articles.filter(a => a.id !== id);
            localStorage.setItem('articles', JSON.stringify(this.articles));
            this.renderArticlesList();
            this.showMessage('Article deleted successfully!', 'success');
        }
    }

    previewArticle(id) {
        const article = this.articles.find(a => a.id === id);
        if (article && article.url) {
            window.open(article.url, '_blank');
        } else {
            this.showMessage('No preview available for this article.', 'warning');
        }
    }

    resetForm() {
        document.getElementById('articleForm').reset();
        this.currentEditId = null;
        document.getElementById('formTitle').textContent = 'Add New Article';
        this.setDefaultDate();
    }

    showMessage(message, type = 'info') {
        // Create a simple message display
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        const bgColor = type === 'success' ? '#27ae60' : type === 'warning' ? '#f39c12' : '#3498db';
        messageDiv.style.backgroundColor = bgColor;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
function showAddForm() {
    adminManager.showAddForm();
}

function resetForm() {
    adminManager.resetForm();
}

// Initialize admin manager
let adminManager;
document.addEventListener('DOMContentLoaded', function() {
    adminManager = new AdminManager();
});

// Add CSS animation for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 