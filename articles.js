const articles = [
  {
    id: 1,
    title: "ওয়েব ডেভেলপমেন্টে HTML5 এর গুরুত্ব",
    excerpt: "ওয়েব ডেভেলপমেন্টে HTML5 কেন গুরুত্বপূর্ণ এবং কিভাবে এটি আপনার ওয়েবসাইটকে আধুনিক করে তোলে জানুন।",
    content: "HTML5 ওয়েব ডেভেলপমেন্টের জন্য একটি মৌলিক প্রযুক্তি। এটি ওয়েবপেজের স্ট্রাকচার নির্ধারণ করে এবং আধুনিক ব্রাউজার ফিচার সাপোর্ট করে। HTML5 এর মাধ্যমে ভিডিও, অডিও, ক্যানভাস, এবং আরও অনেক কিছু সহজেই ইমপ্লিমেন্ট করা যায়।",
    category: "Development",
    date: "2024-06-01",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    tags: ["HTML5", "ওয়েব ডেভেলপমেন্ট", "টেক"],
    seo: {
      description: "ওয়েব ডেভেলপমেন্টে HTML5 এর গুরুত্ব ও ব্যবহার নিয়ে বিস্তারিত আলোচনা।",
      keywords: "HTML5, ওয়েব ডেভেলপমেন্ট, বাংলা টেক আর্টিকেল"
    }
  },
  {
    id: 2,
    title: "CSS Grid ও Flexbox: আধুনিক লেআউট ডিজাইন",
    excerpt: "CSS Grid ও Flexbox দিয়ে কিভাবে দ্রুত ও রেসপনসিভ ওয়েব লেআউট তৈরি করবেন জানুন।",
    content: "CSS Grid ও Flexbox ওয়েব ডিজাইনে বিপ্লব এনেছে। Flexbox ছোট স্কেল লেআউটের জন্য এবং Grid বড় স্কেল লেআউটের জন্য আদর্শ। এদের মাধ্যমে কম কোডে সুন্দর ও রেসপনসিভ ডিজাইন সম্ভব।",
    category: "Design",
    date: "2024-06-02",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    tags: ["CSS", "Grid", "Flexbox", "ওয়েব ডিজাইন"],
    seo: {
      description: "CSS Grid ও Flexbox দিয়ে ওয়েব লেআউট ডিজাইনের সহজ উপায়।",
      keywords: "CSS Grid, Flexbox, ওয়েব ডিজাইন, বাংলা"
    }
  },
  {
    id: 3,
    title: "JavaScript ES6: নতুন ফিচার ও সুবিধা",
    excerpt: "ES6 এর নতুন ফিচার যেমন let, const, arrow function, template literals নিয়ে বিস্তারিত জানুন।",
    content: "JavaScript ES6 ওয়েব ডেভেলপমেন্টকে আরও সহজ ও শক্তিশালী করেছে। let ও const দিয়ে ভ্যারিয়েবল ডিক্লেয়ারেশন, arrow function, template literals, destructuring, এবং আরও অনেক ফিচার কোডিংকে দ্রুত ও ক্লিন করেছে।",
    category: "Development",
    date: "2024-06-03",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    tags: ["JavaScript", "ES6", "ওয়েব ডেভেলপমেন্ট"],
    seo: {
      description: "JavaScript ES6 এর নতুন ফিচার ও তাদের ব্যবহার নিয়ে আলোচনা।",
      keywords: "JavaScript ES6, বাংলা টিউটোরিয়াল, ওয়েব ডেভেলপমেন্ট"
    }
  },
  {
    id: 4,
    title: "রেসপনসিভ ওয়েব ডিজাইন: মোবাইল-ফার্স্ট অ্যাপ্রোচ",
    excerpt: "রেসপনসিভ ওয়েব ডিজাইনের গুরুত্ব ও মোবাইল-ফার্স্ট ডিজাইন কৌশল জানুন।",
    content: "বর্তমানে অধিকাংশ ব্যবহারকারী মোবাইল ডিভাইস ব্যবহার করেন। তাই মোবাইল-ফার্স্ট ডিজাইন ওয়েবসাইটের জন্য অপরিহার্য। CSS Media Queries, ফ্লুয়িড গ্রিড, এবং ফ্লেক্সিবল ইমেজ ব্যবহার করে রেসপনসিভ ডিজাইন তৈরি করুন।",
    category: "Web Design",
    date: "2024-06-04",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    tags: ["রেসপনসিভ", "ওয়েব ডিজাইন", "মোবাইল"],
    seo: {
      description: "রেসপনসিভ ওয়েব ডিজাইন ও মোবাইল-ফার্স্ট অ্যাপ্রোচ নিয়ে বিস্তারিত।",
      keywords: "রেসপনসিভ ওয়েব ডিজাইন, মোবাইল-ফার্স্ট, বাংলা"
    }
  },
  {
    id: 5,
    title: "WordPress কাস্টম থিম ডেভেলপমেন্ট গাইড",
    excerpt: "WordPress কাস্টম থিম ডেভেলপমেন্টের সহজ গাইড ও টিপস।",
    content: "WordPress কাস্টম থিম ডেভেলপমেন্টের জন্য HTML, CSS, PHP ও WordPress Codex জানা জরুরি। functions.php, template files, এবং customizer API ব্যবহার করে ইউনিক থিম তৈরি করুন।",
    category: "WordPress",
    date: "2024-06-05",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    tags: ["WordPress", "থিম ডেভেলপমেন্ট", "ওয়েব ডেভেলপমেন্ট"],
    seo: {
      description: "WordPress কাস্টম থিম ডেভেলপমেন্টের বাংলা গাইড।",
      keywords: "WordPress, থিম ডেভেলপমেন্ট, বাংলা"
    }
  },
  {
    id: 6,
    title: "SEO বেসিক: ওয়েবসাইট র‍্যাঙ্কিংয়ের সহজ কৌশল",
    excerpt: "ওয়েবসাইটের জন্য SEO এর গুরুত্ব ও সহজ কিছু কৌশল জানুন।",
    content: "SEO (Search Engine Optimization) ওয়েবসাইটের অর্গানিক ট্রাফিক বাড়াতে সাহায্য করে। কিওয়ার্ড রিসার্চ, অন-পেজ ও অফ-পেজ SEO, এবং টেকনিক্যাল SEO ফলো করুন।",
    category: "SEO",
    date: "2024-06-06",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    tags: ["SEO", "ওয়েবসাইট", "টেকনিক্যাল"],
    seo: {
      description: "ওয়েবসাইট SEO এর বেসিক কৌশল ও টিপস।",
      keywords: "SEO, ওয়েবসাইট র‍্যাঙ্কিং, বাংলা"
    }
  },
  {
    id: 7,
    title: "React.js: কম্পোনেন্ট বেসড ওয়েব ডেভেলপমেন্ট",
    excerpt: "React.js দিয়ে কিভাবে কম্পোনেন্ট বেসড ওয়েব অ্যাপ তৈরি করবেন জানুন।",
    content: "React.js একটি জনপ্রিয় JavaScript লাইব্রেরি, যা কম্পোনেন্ট বেসড আর্কিটেকচারে ওয়েব অ্যাপ তৈরি করতে সাহায্য করে। JSX, props, state, এবং lifecycle methods React এর মূল ফিচার।",
    category: "Development",
    date: "2024-06-07",
    image: "https://images.unsplash.com/photo-1461344577544-4e5dc9487184?auto=format&fit=crop&w=600&q=80",
    tags: ["React.js", "JavaScript", "ওয়েব ডেভেলপমেন্ট"],
    seo: {
      description: "React.js দিয়ে কম্পোনেন্ট বেসড ওয়েব ডেভেলপমেন্টের বাংলা টিউটোরিয়াল।",
      keywords: "React.js, কম্পোনেন্ট, বাংলা"
    }
  },
  {
    id: 8,
    title: "ওয়েব পারফরম্যান্স অপটিমাইজেশন টিপস",
    excerpt: "ওয়েবসাইট দ্রুত লোড করার জন্য কিছু কার্যকরী টিপস ও কৌশল।",
    content: "ওয়েব পারফরম্যান্স বাড়াতে ইমেজ অপটিমাইজেশন, কোড মিনিফিকেশন, ক্যাশিং, এবং CDN ব্যবহার করুন। দ্রুত লোডিং ওয়েবসাইট ইউজার এক্সপেরিয়েন্স ও SEO তে সহায়ক।",
    category: "Development",
    date: "2024-06-08",
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3c8a?auto=format&fit=crop&w=600&q=80",
    tags: ["পারফরম্যান্স", "ওয়েব ডেভেলপমেন্ট", "SEO"],
    seo: {
      description: "ওয়েব পারফরম্যান্স অপটিমাইজেশনের বাংলা টিপস ও কৌশল।",
      keywords: "ওয়েব পারফরম্যান্স, অপটিমাইজেশন, বাংলা"
    }
  },
  {
    id: 9,
    title: "Git & GitHub: ভার্সন কন্ট্রোলের সহজ পরিচিতি",
    excerpt: "Git ও GitHub দিয়ে কিভাবে প্রজেক্ট ম্যানেজ ও ভার্সন কন্ট্রোল করবেন জানুন।",
    content: "Git একটি ভার্সন কন্ট্রোল সিস্টেম এবং GitHub একটি কোড হোস্টিং প্ল্যাটফর্ম। Git দিয়ে কোডের পরিবর্তন ট্র্যাক করুন এবং GitHub এ প্রজেক্ট শেয়ার করুন।",
    category: "Development",
    date: "2024-06-09",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    tags: ["Git", "GitHub", "ভার্সন কন্ট্রোল"],
    seo: {
      description: "Git ও GitHub এর বাংলা পরিচিতি ও ব্যবহার।",
      keywords: "Git, GitHub, ভার্সন কন্ট্রোল, বাংলা"
    }
  },
  {
    id: 10,
    title: "API কী ও কিভাবে কাজ করে?",
    excerpt: "API (Application Programming Interface) কী এবং ওয়েব ডেভেলপমেন্টে এর ব্যবহার জানুন।",
    content: "API ওয়েব ডেভেলপমেন্টে ডেটা আদান-প্রদানের জন্য ব্যবহৃত হয়। RESTful API, JSON, এবং AJAX এর মাধ্যমে ক্লায়েন্ট ও সার্ভারের মধ্যে যোগাযোগ সহজ হয়।",
    category: "Development",
    date: "2024-06-10",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    tags: ["API", "ওয়েব ডেভেলপমেন্ট", "AJAX"],
    seo: {
      description: "API কী, কিভাবে কাজ করে ও ওয়েব ডেভেলপমেন্টে এর ব্যবহার।",
      keywords: "API, ওয়েব ডেভেলপমেন্ট, বাংলা"
    }
  }
];

// Expose articles for use in all-articles.html rendering
if (typeof window !== 'undefined') {
  window.articles = articles;
}

// Articles rendering and management
document.addEventListener('DOMContentLoaded', function() {
  const articlesGrid = document.getElementById('articlesGrid');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const pagination = document.getElementById('pagination');
  const noResults = document.getElementById('noResults');

  let currentPage = 1;
  const articlesPerPage = 6;
  let filteredArticles = [...articles];

  // Format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Create article card HTML
  function createArticleCard(article) {
    return `
      <article class="blog-card">
        <div class="blog-image">
          <img src="${article.image}" alt="${article.title}" loading="lazy">
        </div>
        <div class="blog-content">
          <div class="blog-meta">
            <span class="blog-category">${article.category}</span>
            <span class="blog-date">${formatDate(article.date)}</span>
          </div>
          <h3>${article.title}</h3>
          <p>${article.excerpt}</p>
          <div class="blog-tags">
            ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <a href="blog-article.html?id=${article.id}" class="read-more">
            পড়ুন <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </article>
    `;
  }

  // Filter articles
  function filterArticles() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    filteredArticles = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm) ||
                           article.excerpt.toLowerCase().includes(searchTerm) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort articles
    const sortBy = sortFilter.value;
    switch(sortBy) {
      case 'newest':
        filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filteredArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'title':
        filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'popular':
        // For demo, we'll sort by ID (assuming higher ID = more popular)
        filteredArticles.sort((a, b) => b.id - a.id);
        break;
    }

    currentPage = 1;
    renderArticles();
  }

  // Render articles with pagination
  function renderArticles() {
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const articlesToShow = filteredArticles.slice(startIndex, endIndex);

    if (articlesToShow.length === 0) {
      articlesGrid.innerHTML = '';
      noResults.style.display = 'block';
      pagination.innerHTML = '';
      return;
    }

    noResults.style.display = 'none';
    articlesGrid.innerHTML = articlesToShow.map(createArticleCard).join('');
    renderPagination();
  }

  // Render pagination
  function renderPagination() {
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    
    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }

    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
      paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})">
        <i class="fas fa-chevron-left"></i> আগের
      </button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        paginationHTML += `<button class="pagination-btn active">${i}</button>`;
      } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${i})">${i}</button>`;
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        paginationHTML += `<span class="pagination-dots">...</span>`;
      }
    }

    // Next button
    if (currentPage < totalPages) {
      paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})">
        পরের <i class="fas fa-chevron-right"></i>
      </button>`;
    }

    pagination.innerHTML = paginationHTML;
  }

  // Go to specific page
  window.goToPage = function(page) {
    currentPage = page;
    renderArticles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Event listeners
  searchInput.addEventListener('input', filterArticles);
  categoryFilter.addEventListener('change', filterArticles);
  sortFilter.addEventListener('change', filterArticles);

  // Initial render
  renderArticles();
}); 