// Articles.js file

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Default articles (fallback if API is not available)
const defaultArticles = [
    {
        id: '1',
        title: "🌐 নিজের ওয়েবসাইট ব্র্যান্ড করুন: সফল অনলাইন উপস্থিতির শক্তিশালী কৌশল",
        excerpt: "বর্তমানে আপনি যদি ই-কমার্স করেন, সেবা ভিত্তিক ব্যবসা চালান, পোর্টফোলিও তৈরি করেন বা কনটেন্ট ক্রিয়েটর হন — নিজের একটি ওয়েবসাইট থাকা প্রয়োজন। তবু একটি ওয়েবসাইট বানানোই যথেষ্ট নয়, সেটিকে একটি শক্তিশালী ব্র্যান্ডে পরিণত করাই মূল লক্ষ্য হওয়া উচিত।",
        category: "ব্র্যান্ডিং",
        date: "জানুয়ারি ২০, ২০২৪",
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80",
        tags: ["ব্র্যান্ডিং", "ওয়েবসাইট", "মার্কেটিং"],
        featured: true,
        slug: "website-branding-strategies"
    },
    {
        id: '2',
        title: "প্রতিটি ওয়েবসাইটের জন্য ১০টি অপরিহার্য WordPress প্লাগইন",
        excerpt: "আপনার ওয়েবসাইটের কার্যকারিতা, নিরাপত্তা এবং পারফরম্যান্স বাড়াতে সাহায্য করবে এমন অপরিহার্য WordPress প্লাগইনগুলি আবিষ্কার করুন।",
        category: "WordPress",
        date: "জানুয়ারি ১৫, ২০২৪",
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
        tags: ["WordPress", "প্লাগইন", "SEO"],
        featured: false,
        slug: "essential-wordpress-plugins"
    }
];

// Fetch articles from API
async function fetchArticles(page = 1, limit = 10, category = '', search = '', sort = 'newest') {
    try {
        let url = `${API_BASE_URL}/articles?page=${page}&limit=${limit}`;
        
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (sort) url += `&sort=${sort}`;

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching articles from API:', error);
        // Fallback to default articles
        return {
            success: true,
            data: defaultArticles,
            count: defaultArticles.length,
            total: defaultArticles.length,
            totalPages: 1,
            currentPage: 1
        };
    }
}

// Fetch featured articles
async function fetchFeaturedArticles() {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/featured`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching featured articles:', error);
        // Return featured articles from default
        return {
            success: true,
            data: defaultArticles.filter(article => article.featured),
            count: defaultArticles.filter(article => article.featured).length
        };
    }
}

// Fetch categories
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/categories/list`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        // Return default categories
        return ['ব্র্যান্ডিং', 'WordPress', 'ওয়েব ডিজাইন', 'ডেভেলপমেন্ট', 'SEO'];
    }
}

// Fetch single article by slug
async function fetchArticleBySlug(slug) {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/slug/${slug}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}

// Render articles
function renderArticles(articles, container) {
    if (!articles || articles.length === 0) {
        container.innerHTML = '<div class="no-articles"><p>কোন আর্টিকেল পাওয়া যায়নি</p></div>';
        return;
    }

    const articlesHTML = articles.map(article => `
        <article class="blog-card ${article.featured ? 'featured' : ''}">
            <div class="blog-image">
                <img src="${article.image}" alt="${article.title}" loading="lazy">
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-category">${article.category}</span>
                    <span class="blog-date">${article.formattedDate || article.date}</span>
                </div>
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div class="blog-tags">
                    ${article.tags ? article.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
                <a href="article.html?slug=${article.slug}" class="read-more">
                    সম্পূর্ণ আর্টিকেল পড়ুন <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `).join('');

    container.innerHTML = articlesHTML;
}

// Render pagination
function renderPagination(currentPage, totalPages, container) {
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let paginationHTML = '<div class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="page-btn" data-page="${currentPage - 1}">পূর্ববর্তী</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="page-btn active" data-page="${i}">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `<button class="page-btn" data-page="${i}">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += '<span class="page-dots">...</span>';
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="page-btn" data-page="${currentPage + 1}">পরবর্তী</button>`;
    }
    
    paginationHTML += '</div>';
    container.innerHTML = paginationHTML;
}

// Initialize all articles page
async function initializeAllArticlesPage() {
    const articlesContainer = document.getElementById('articles-container');
    const paginationContainer = document.getElementById('pagination-container');
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    
    if (!articlesContainer) return;

    let currentPage = 1;
    let currentCategory = '';
    let currentSearch = '';
    let currentSort = 'newest';

    // Load categories
    const categories = await fetchCategories();
    if (categoryFilter) {
        categoryFilter.innerHTML = '<option value="">সব ক্যাটাগরি</option>' +
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    }

    // Load initial articles
    async function loadArticles() {
        const data = await fetchArticles(currentPage, 9, currentCategory, currentSearch, currentSort);
        
        if (data.success) {
            renderArticles(data.data, articlesContainer);
            renderPagination(data.currentPage, data.totalPages, paginationContainer);
        }
    }

    // Event listeners
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            currentPage = 1;
            loadArticles();
        });
    }

    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentSearch = e.target.value;
                currentPage = 1;
                loadArticles();
            }, 500);
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            currentPage = 1;
            loadArticles();
        });
    }

    // Pagination event delegation
    if (paginationContainer) {
        paginationContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('page-btn')) {
                currentPage = parseInt(e.target.dataset.page);
                loadArticles();
            }
        });
    }

    // Load initial articles
    await loadArticles();
}

// Initialize featured articles for main page
async function initializeFeaturedArticles() {
    const featuredContainer = document.querySelector('.blog-grid');
    if (!featuredContainer) return;

    const data = await fetchFeaturedArticles();
    
    if (data.success && data.data.length > 0) {
        // Keep the first article as featured, add others
        const featuredArticles = data.data.slice(0, 7); // Show 7 articles total
        renderArticles(featuredArticles, featuredContainer);
    }
}

// Initialize single article page
async function initializeArticlePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        window.location.href = 'all-articles.html';
        return;
    }

    const articleContainer = document.getElementById('article-container');
    if (!articleContainer) return;

    const data = await fetchArticleBySlug(slug);
    
    if (data && data.success) {
        const article = data.data;
        
        // Update page title
        document.title = `${article.title} - WebCraft Studio`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = article.seo?.description || article.excerpt;
        }

        // Render article
        articleContainer.innerHTML = `
            <article class="single-article">
                <header class="article-header">
                    <div class="article-meta">
                        <span class="article-category">${article.category}</span>
                        <span class="article-date">${article.formattedDate || article.date}</span>
                        <span class="article-author">${article.author}</span>
                        <span class="article-read-time">${article.readTime || 5} মিনিট পড়া</span>
                    </div>
                    <h1 class="article-title">${article.title}</h1>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-tags">
                        ${article.tags ? article.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                    </div>
                </header>
                
                <div class="article-image">
                    <img src="${article.image}" alt="${article.title}">
                </div>
                
                <div class="article-content">
                    ${article.content}
                </div>
                
                <footer class="article-footer">
                    <div class="article-stats">
                        <span class="views">${article.views || 0} বার দেখা হয়েছে</span>
                        <span class="likes">${article.likes || 0} পছন্দ</span>
                    </div>
                </footer>
            </article>
        `;
    } else {
        articleContainer.innerHTML = `
            <div class="error-message">
                <h2>আর্টিকেল পাওয়া যায়নি</h2>
                <p>দুঃখিত, আপনি যে আর্টিকেল খুঁজছেন তা পাওয়া যায়নি।</p>
                <a href="all-articles.html" class="btn">সব আর্টিকেল দেখুন</a>
            </div>
        `;
    }
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('all-articles.html')) {
        initializeAllArticlesPage();
    } else if (currentPage.includes('article.html')) {
        initializeArticlePage();
    } else if (currentPage.includes('index.html') || currentPage === '/') {
        initializeFeaturedArticles();
    }
});

// Export functions for use in other scripts
window.ArticleAPI = {
    fetchArticles,
    fetchFeaturedArticles,
    fetchCategories,
    fetchArticleBySlug,
    renderArticles
};
