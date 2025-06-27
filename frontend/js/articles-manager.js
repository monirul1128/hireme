// Articles Management System
class ArticlesManager {
    constructor() {
        this.articles = [
            {
                id: 1,
                title: "10 Essential WordPress Plugins for Every Website",
                excerpt: "Discover the must-have WordPress plugins that will enhance your website's functionality, security, and performance. From SEO optimization to security hardening, these plugins are essential for any WordPress site.",
                category: "WordPress",
                date: "2024-01-15",
                tags: ["WordPress", "Plugins", "SEO"],
                icon: "fas fa-wordpress",
                url: "blog-article.html",
                featured: true,
                readTime: "8 min read"
            },
            {
                id: 2,
                title: "Mobile-First Design: Why It's Crucial for SEO",
                excerpt: "Learn why mobile-first design is not just a trend but a necessity for modern websites. Discover how it impacts your SEO rankings and user experience.",
                category: "Web Design",
                date: "2024-01-12",
                tags: ["Mobile", "SEO", "UX"],
                icon: "fas fa-mobile-alt",
                url: "#",
                featured: false,
                readTime: "6 min read"
            },
            {
                id: 3,
                title: "Landing Page Optimization: 5 Proven Strategies",
                excerpt: "Explore five proven strategies to optimize your landing pages for maximum conversions. From compelling headlines to strategic CTAs, learn what makes a landing page successful.",
                category: "Landing Pages",
                date: "2024-01-10",
                tags: ["Conversion", "Landing Pages", "CRO"],
                icon: "fas fa-chart-line",
                url: "#",
                featured: false,
                readTime: "7 min read"
            },
            {
                id: 4,
                title: "Modern CSS Techniques for Better Performance",
                excerpt: "Discover modern CSS techniques that can significantly improve your website's performance. From CSS Grid to custom properties, learn how to write efficient, maintainable CSS.",
                category: "Development",
                date: "2024-01-08",
                tags: ["CSS", "Performance", "Frontend"],
                icon: "fas fa-code",
                url: "#",
                featured: false,
                readTime: "10 min read"
            },
            {
                id: 5,
                title: "Technical SEO Checklist for 2024",
                excerpt: "A comprehensive technical SEO checklist to ensure your website is optimized for search engines. Cover everything from page speed to structured data.",
                category: "SEO",
                date: "2024-01-05",
                tags: ["SEO", "Technical", "2024"],
                icon: "fas fa-search",
                url: "#",
                featured: false,
                readTime: "12 min read"
            },
            {
                id: 6,
                title: "Color Psychology in Web Design",
                excerpt: "Understand how colors influence user behavior and emotions. Learn how to choose the right color palette for your website to achieve your business goals.",
                category: "Design",
                date: "2024-01-03",
                tags: ["Design", "Colors", "Psychology"],
                icon: "fas fa-palette",
                url: "#",
                featured: false,
                readTime: "9 min read"
            },
            {
                id: 7,
                title: "WordPress Security Best Practices 2024",
                excerpt: "Essential security measures to protect your WordPress website from threats. Learn about plugins, configurations, and monitoring techniques.",
                category: "WordPress",
                date: "2024-01-01",
                tags: ["WordPress", "Security", "Best Practices"],
                icon: "fas fa-shield-alt",
                url: "#",
                featured: false,
                readTime: "11 min read"
            },
            {
                id: 8,
                title: "JavaScript Performance Optimization Tips",
                excerpt: "Learn advanced JavaScript techniques to improve your website's performance. From code splitting to lazy loading, optimize your scripts for better user experience.",
                category: "Development",
                date: "2023-12-28",
                tags: ["JavaScript", "Performance", "Optimization"],
                icon: "fas fa-rocket",
                url: "#",
                featured: false,
                readTime: "15 min read"
            },
            {
                id: 9,
                title: "User Experience Design Principles",
                excerpt: "Master the fundamental principles of UX design to create websites that users love. Learn about usability, accessibility, and user-centered design.",
                category: "Web Design",
                date: "2023-12-25",
                tags: ["UX", "Design", "Usability"],
                icon: "fas fa-users",
                url: "#",
                featured: false,
                readTime: "13 min read"
            },
            {
                id: 10,
                title: "E-commerce Website Optimization Guide",
                excerpt: "Complete guide to optimizing your e-commerce website for better conversions and sales. From product pages to checkout optimization.",
                category: "Landing Pages",
                date: "2023-12-22",
                tags: ["E-commerce", "Conversion", "Sales"],
                icon: "fas fa-shopping-cart",
                url: "#",
                featured: false,
                readTime: "14 min read"
            }
        ];

        this.currentPage = 1;
        this.articlesPerPage = 6;
        this.filteredArticles = [...this.articles];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderArticles();
        this.renderPagination();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.handleFilter();
            });
        }

        // Sort filter
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.handleFilter();
            });
        }
    }

    handleSearch(searchTerm) {
        this.currentPage = 1;
        this.filteredArticles = this.articles.filter(article => {
            const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const categoryFilter = document.getElementById('categoryFilter');
            const matchesCategory = !categoryFilter.value || article.category === categoryFilter.value;
            
            return matchesSearch && matchesCategory;
        });
        
        this.renderArticles();
        this.renderPagination();
        this.showNoResults();
    }

    handleFilter() {
        this.currentPage = 1;
        const searchTerm = document.getElementById('searchInput').value;
        const categoryFilter = document.getElementById('categoryFilter').value;
        const sortFilter = document.getElementById('sortFilter').value;

        this.filteredArticles = this.articles.filter(article => {
            const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesCategory = !categoryFilter || article.category === categoryFilter;
            
            return matchesSearch && matchesCategory;
        });

        // Sort articles
        this.sortArticles(sortFilter);
        
        this.renderArticles();
        this.renderPagination();
        this.showNoResults();
    }

    sortArticles(sortType) {
        switch (sortType) {
            case 'newest':
                this.filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                this.filteredArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'title':
                this.filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'popular':
                // For now, sort by date (you can add view count later)
                this.filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }
    }

    renderArticles() {
        const articlesGrid = document.getElementById('articlesGrid');
        if (!articlesGrid) return;

        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const articlesToShow = this.filteredArticles.slice(startIndex, endIndex);

        articlesGrid.innerHTML = articlesToShow.map(article => this.createArticleCard(article)).join('');
    }

    createArticleCard(article) {
        const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <article class="blog-card ${article.featured ? 'featured' : ''}" data-id="${article.id}">
                <div class="blog-image">
                    <i class="${article.icon}"></i>
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-category">${article.category}</span>
                        <span class="blog-date">${formattedDate}</span>
                        <span class="blog-read-time">${article.readTime}</span>
                    </div>
                    <h3>${article.title}</h3>
                    <p>${article.excerpt}</p>
                    <div class="blog-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <a href="${article.url}" class="read-more">Read Full Article <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `;
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="articlesManager.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Previous
            </button>`;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="pagination-btn active">${i}</button>`;
            } else if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `<button class="pagination-btn" onclick="articlesManager.goToPage(${i})">${i}</button>`;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" onclick="articlesManager.goToPage(${this.currentPage + 1})">
                Next <i class="fas fa-chevron-right"></i>
            </button>`;
        }

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderArticles();
        this.renderPagination();
        
        // Scroll to top of articles section
        const articlesSection = document.querySelector('.all-articles-section');
        if (articlesSection) {
            articlesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showNoResults() {
        const noResults = document.getElementById('noResults');
        const articlesGrid = document.getElementById('articlesGrid');
        
        if (this.filteredArticles.length === 0) {
            if (noResults) noResults.style.display = 'block';
            if (articlesGrid) articlesGrid.style.display = 'none';
        } else {
            if (noResults) noResults.style.display = 'none';
            if (articlesGrid) articlesGrid.style.display = 'grid';
        }
    }
}

// Initialize the articles manager when the page loads
let articlesManager;
document.addEventListener('DOMContentLoaded', function() {
    articlesManager = new ArticlesManager();
});

// Add CSS for new elements
const additionalStyles = `
    .blog-read-time {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.8rem;
    }
    
    .pagination-dots {
        color: #666;
        padding: 0 0.5rem;
    }
`;

// Inject additional styles
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet); 