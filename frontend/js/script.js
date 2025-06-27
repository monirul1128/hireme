// DOM Elements
const header = document.querySelector('.header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const ctaButtons = document.querySelectorAll('.cta-button, .mobile-cta-button, .hero-cta');
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const contactForm = document.querySelector('.contact-form form');
const skillBars = document.querySelectorAll('.skill-progress');

// Mobile Menu Toggle
function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    // Prevent body scroll when mobile menu is open
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    mobileMenuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// Header scroll effect
function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    let currentSection = '';

    // Find the current section
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });

    // If we're at the very top, set home as active
    if (scrollPos < 100) {
        currentSection = 'home';
    }

    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to corresponding links
    if (currentSection) {
        const activeLinks = document.querySelectorAll(`[href="#${currentSection}"]`);
        activeLinks.forEach(link => {
            link.classList.add('active');
        });
    }
}

// Smooth scrolling for navigation links
function smoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu after clicking a link
        closeMobileMenu();
    }
}

// Portfolio filtering
function filterPortfolio(category) {
    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter portfolio items
    portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            item.style.display = 'none';
        }
    });
}

// Animate skill bars on scroll
function animateSkillBars() {
    skillBars.forEach(bar => {
        const barTop = bar.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (barTop < windowHeight - 100) {
            const percentage = bar.getAttribute('data-percentage');
            bar.style.width = percentage + '%';
        }
    });
}

// CTA Button click handlers
function handleCTAClick(e) {
    e.preventDefault();
    
    // Add a nice ripple effect
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // Handle different CTA actions
    if (button.textContent.includes('Get Started') || button.textContent.includes('Hire Me')) {
        // Scroll to contact section
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    } else if (button.textContent.includes('Learn More')) {
        // Scroll to about section
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = aboutSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    } else if (button.textContent.includes('View My Work')) {
        // Scroll to portfolio section
        const portfolioSection = document.querySelector('#portfolio');
        if (portfolioSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = portfolioSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    } else if (button.textContent.includes('Download CV')) {
        // Simulate CV download
        alert('CV download started! (This is a demo - replace with actual CV file)');
    }
}

// Contact form handling
function handleContactForm(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    emailjs.sendForm('service_mda0evj', 'template_lymsd2q', form)
        .then(() => {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                form.reset();
            }, 3000);
        })
        .catch(() => {
            submitBtn.textContent = 'Error! Try Again';
            submitBtn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        });
}

// Add ripple effect styles
function addRippleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize all event listeners
function initEventListeners() {
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // CTA buttons
    ctaButtons.forEach(button => {
        button.addEventListener('click', handleCTAClick);
    });
    
    // Portfolio filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-filter');
            filterPortfolio(category);
        });
    });
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Scroll events
    window.addEventListener('scroll', () => {
        handleScroll();
        updateActiveNavLink();
        animateSkillBars();
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (header && !header.contains(e.target) && mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Add loading animation
function addLoadingAnimation() {
    if (header) {
        const headerElements = header.querySelectorAll('.header-container > *');
        
        headerElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Initialize skill bars with data attributes
function initializeSkillBars() {
    skillBars.forEach(bar => {
        const percentage = bar.getAttribute('data-percentage') || '0';
        bar.style.width = '0%';
        bar.setAttribute('data-percentage', percentage);
    });
}

// Add some interactive hover effects for desktop
function addDesktopHoverEffects() {
    if (window.innerWidth > 768) {
        const navItems = document.querySelectorAll('.nav-item');
        const serviceCards = document.querySelectorAll('.service-card');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-2px)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
            });
        });
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Add intersection observer for animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addRippleStyles();
    initEventListeners();
    addLoadingAnimation();
    initializeSkillBars();
    addDesktopHoverEffects();
    addScrollAnimations();
    
    // Set initial active state
    updateActiveNavLink();
    
    // Trigger skill bar animation on initial load
    setTimeout(animateSkillBars, 1000);
    
    // Handle WhatsApp CTA button
    const whatsappButton = document.querySelector('.cta-button');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function (event) {
            // Add ripple animation
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${event.offsetX}px`;
            ripple.style.top = `${event.offsetY}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
      
            // Open WhatsApp chat
            const phoneNumber = '+8801625976726';
            const message = encodeURIComponent("Hello! I'd like to chat with you.");
            const url = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`;
            window.open(url, '_blank');
        });
    }
}); 