// E-Commerce Demo JavaScript

// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 89.99,
        originalPrice: 129.99,
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
        rating: 4.5,
        badge: "Sale"
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        category: "Electronics",
        price: 199.99,
        originalPrice: 249.99,
        description: "Advanced fitness tracking with heart rate monitor and GPS capabilities.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        badge: "New"
    },
    {
        id: 3,
        name: "Premium Cotton T-Shirt",
        category: "Clothing",
        price: 29.99,
        originalPrice: 39.99,
        description: "Comfortable and stylish cotton t-shirt available in multiple colors.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
        rating: 4.3,
        badge: "Sale"
    },
    {
        id: 4,
        name: "Designer Denim Jeans",
        category: "Clothing",
        price: 79.99,
        originalPrice: 99.99,
        description: "Classic fit denim jeans with premium quality and modern styling.",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80",
        rating: 4.6,
        badge: "Popular"
    },
    {
        id: 5,
        name: "Web Development Guide",
        category: "Books",
        price: 34.99,
        originalPrice: 44.99,
        description: "Comprehensive guide to modern web development techniques and best practices.",
        image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        badge: "Bestseller"
    },
    {
        id: 6,
        name: "Smart Home Hub",
        category: "Electronics",
        price: 149.99,
        originalPrice: 199.99,
        description: "Central control hub for all your smart home devices and automation.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
        rating: 4.4,
        badge: "Sale"
    },
    {
        id: 7,
        name: "Organic Garden Seeds",
        category: "Home",
        price: 19.99,
        originalPrice: 24.99,
        description: "Premium organic seeds for growing your own vegetables and herbs.",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80",
        rating: 4.2,
        badge: "Organic"
    },
    {
        id: 8,
        name: "Modern Coffee Table",
        category: "Home",
        price: 299.99,
        originalPrice: 399.99,
        description: "Elegant modern coffee table with storage and premium wood finish.",
        image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=400&q=80",
        rating: 4.9,
        badge: "Premium"
    }
];

// Cart state
let cart = [];
let filteredProducts = [...products];

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const overlay = document.getElementById('overlay');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Filter event listeners
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('sortFilter').addEventListener('change', filterProducts);
    document.getElementById('priceFilter').addEventListener('change', filterProducts);
    
    // Search functionality
    document.querySelector('.search-bar input').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterProducts();
    });
}

// Render products
function renderProducts() {
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        </div>
        <div class="product-content">
            <div class="product-category">${product.category}</div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
            </div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Filter products
function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const searchTerm = document.querySelector('.search-bar input').value.toLowerCase();
    
    filteredProducts = products.filter(product => {
        // Category filter
        if (categoryFilter && product.category !== categoryFilter) return false;
        
        // Search filter
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm) && 
            !product.description.toLowerCase().includes(searchTerm)) return false;
        
        // Price filter
        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(Number);
            if (max && (product.price < min || product.price > max)) return false;
            if (!max && product.price < min) return false;
        }
        
        return true;
    });
    
    // Sort products
    switch(sortFilter) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    renderProducts();
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification('Product added to cart!', 'success');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Product removed from cart!', 'info');
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Update cart display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;
        cartTotal.innerHTML = '';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: 10px; background: #e74c3c; color: white;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Update cart total
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax;
        
        cartTotal.innerHTML = `
            <div class="total-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>Tax (8%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="total-row final">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button class="checkout-btn" onclick="checkout()">
                <i class="fas fa-credit-card"></i> Proceed to Checkout
            </button>
        `;
    }
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : '';
}

// Toggle wishlist (placeholder function)
function toggleWishlist(productId) {
    showNotification('Added to wishlist!', 'success');
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'warning');
        return;
    }
    
    showNotification('Checkout functionality would be implemented here!', 'info');
    // In a real application, this would redirect to a checkout page
    // or open a checkout modal
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 10px;
        padding: 15px 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left: 4px solid #28a745;
    }

    .notification-error {
        border-left: 4px solid #dc3545;
    }

    .notification-warning {
        border-left: 4px solid #ffc107;
    }

    .notification-info {
        border-left: 4px solid #17a2b8;
    }

    .notification i {
        font-size: 1.2rem;
    }

    .notification-success i {
        color: #28a745;
    }

    .notification-error i {
        color: #dc3545;
    }

    .notification-warning i {
        color: #ffc107;
    }

    .notification-info i {
        color: #17a2b8;
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet); 