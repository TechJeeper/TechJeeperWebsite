// Shop Highlights Integration
class ShopHighlights {
    constructor() {
        this.sliderContainer = document.querySelector('.highlights-slider');
        this.prevButton = document.querySelector('.prev-slide');
        this.nextButton = document.querySelector('.next-slide');
        this.currentIndex = 0;
        this.items = [];
        this.init();
    }

    async init() {
        // Example featured items for testing
        this.items = [
            {
                image: 'https://via.placeholder.com/400x300',
                title: 'Custom Jeep Design T-Shirt',
                description: 'Limited edition off-road inspired design',
                price: '$24.99',
                link: 'https://ko-fi.com/techjeeper/shop'
            },
            {
                image: 'https://via.placeholder.com/400x300',
                title: 'Adventure Sticker Pack',
                description: 'Set of 5 waterproof vinyl stickers',
                price: '$12.99',
                link: 'https://ko-fi.com/techjeeper/shop'
            },
            {
                image: 'https://via.placeholder.com/400x300',
                title: 'Digital Art Print',
                description: 'High-quality 12x18 print',
                price: '$19.99',
                link: 'https://ko-fi.com/techjeeper/shop'
            }
        ];
        
        this.renderSlider();
        this.addEventListeners();
    }

    renderSlider() {
        const itemsHTML = this.items.map((item, index) => `
            <div class="featured-item ${index === 0 ? 'active' : ''}">
                <img src="${item.image}" alt="${item.title}">
                <div class="featured-item-info">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <p class="price">${item.price}</p>
                </div>
            </div>
        `).join('');

        this.sliderContainer.innerHTML = itemsHTML;
    }

    addEventListeners() {
        this.prevButton.addEventListener('click', () => this.navigate('prev'));
        this.nextButton.addEventListener('click', () => this.navigate('next'));
    }

    navigate(direction) {
        const items = document.querySelectorAll('.featured-item');
        items[this.currentIndex].classList.remove('active');

        if (direction === 'next') {
            this.currentIndex = (this.currentIndex + 1) % items.length;
        } else {
            this.currentIndex = (this.currentIndex - 1 + items.length) % items.length;
        }

        items[this.currentIndex].classList.add('active');
    }
}

// BlueSky Feed Integration with Highlights
class BlueSkyFeed {
    constructor() {
        this.feedContainer = document.querySelector('.bluesky-feed');
        this.highlightsContainer = document.querySelector('.highlights-carousel');
        this.indicatorsContainer = document.querySelector('.carousel-indicators');
        this.currentHighlight = 0;
        this.highlights = [];
        this.init();
    }

    async init() {
        // Example featured posts for testing
        this.highlights = [
            {
                author: {
                    name: 'TechJeeper',
                    avatar: 'https://via.placeholder.com/50x50'
                },
                text: 'Just launched my new custom Jeep design collection! Check it out in the shop 🚙✨',
                createdAt: new Date(),
                images: ['https://via.placeholder.com/600x400'],
                likes: 42,
                reposts: 12
            },
            {
                author: {
                    name: 'TechJeeper',
                    avatar: 'https://via.placeholder.com/50x50'
                },
                text: 'Working on some exciting new digital art pieces. Stay tuned! 🎨',
                createdAt: new Date(Date.now() - 86400000), // 1 day ago
                images: ['https://via.placeholder.com/600x400'],
                likes: 38,
                reposts: 8
            },
            {
                author: {
                    name: 'TechJeeper',
                    avatar: 'https://via.placeholder.com/50x50'
                },
                text: 'New sticker designs dropping next week! Which is your favorite? 🌟',
                createdAt: new Date(Date.now() - 172800000), // 2 days ago
                images: ['https://via.placeholder.com/600x400'],
                likes: 56,
                reposts: 15
            }
        ];
        
        this.renderHighlights();
        this.renderFeed(this.highlights); // Use the same data for the feed for now
        this.addEventListeners();
    }

    renderHighlights() {
        const highlightsHTML = this.highlights.map((post, index) => `
            <div class="featured-post ${index === 0 ? 'active' : ''}">
                <div class="featured-post-header">
                    <img src="${post.author.avatar}" alt="${post.author.name}" class="featured-post-avatar">
                    <div class="featured-post-info">
                        <h4>${post.author.name}</h4>
                        <span class="featured-post-date">${this.formatDate(post.createdAt)}</span>
                    </div>
                </div>
                <div class="featured-post-content">
                    <p>${post.text}</p>
                    ${post.images ? this.renderImages(post.images) : ''}
                </div>
                <div class="post-actions">
                    <button class="like-button">
                        <i class="far fa-heart"></i>
                        <span>${post.likes}</span>
                    </button>
                    <button class="repost-button">
                        <i class="fas fa-retweet"></i>
                        <span>${post.reposts}</span>
                    </button>
                </div>
            </div>
        `).join('');

        const indicatorsHTML = this.highlights.map((_, index) => `
            <div class="carousel-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
        `).join('');

        this.highlightsContainer.innerHTML = highlightsHTML;
        this.indicatorsContainer.innerHTML = indicatorsHTML;
    }

    addEventListeners() {
        this.indicatorsContainer.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.showHighlight(index));
        });

        // Auto-rotate highlights
        setInterval(() => {
            this.showHighlight((this.currentHighlight + 1) % this.highlights.length);
        }, 5000);
    }

    showHighlight(index) {
        const posts = document.querySelectorAll('.featured-post');
        const indicators = document.querySelectorAll('.carousel-indicator');

        posts[this.currentHighlight].classList.remove('active');
        indicators[this.currentHighlight].classList.remove('active');

        this.currentHighlight = index;

        posts[this.currentHighlight].classList.add('active');
        indicators[this.currentHighlight].classList.add('active');
    }

    renderFeed(posts) {
        if (!posts || posts.length === 0) {
            this.showError();
            return;
        }

        const feedHTML = posts.map(post => `
            <div class="bluesky-post">
                <div class="post-header">
                    <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar">
                    <div class="post-info">
                        <h4>${post.author.name}</h4>
                        <span class="post-date">${this.formatDate(post.createdAt)}</span>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.text}</p>
                    ${post.images ? this.renderImages(post.images) : ''}
                </div>
                <div class="post-actions">
                    <button class="like-button" data-post-id="${post.id}">
                        <i class="far fa-heart"></i>
                        <span>${post.likes}</span>
                    </button>
                    <button class="repost-button" data-post-id="${post.id}">
                        <i class="fas fa-retweet"></i>
                        <span>${post.reposts}</span>
                    </button>
                </div>
            </div>
        `).join('');

        this.feedContainer.innerHTML = feedHTML;
        this.addEventListeners();
    }

    renderImages(images) {
        return `
            <div class="post-images">
                ${images.map(image => `
                    <img src="${image.url}" alt="${image.alt}" class="post-image">
                `).join('')}
            </div>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    async handlePostAction(postId, action) {
        try {
            // Note: Implement actual API calls here
            console.log(`${action} post ${postId}`);
        } catch (error) {
            console.error(`Error ${action}ing post:`, error);
        }
    }

    showError() {
        this.feedContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Unable to load BlueSky feed. Please try again later.</p>
            </div>
        `;
    }
}

// Portfolio Integration
class Portfolio {
    constructor() {
        this.portfolioGrid = document.querySelector('.portfolio-grid');
        this.init();
    }

    async init() {
        try {
            // Note: Replace with your actual portfolio API endpoint
            const response = await fetch('https://printventory.com/api/portfolio');
            const data = await response.json();
            this.renderPortfolio(data);
        } catch (error) {
            console.error('Error loading portfolio:', error);
            this.showError();
        }
    }

    renderPortfolio(items) {
        if (!items || items.length === 0) {
            this.showError();
            return;
        }

        const portfolioHTML = items.map(item => `
            <div class="portfolio-item">
                <img src="${item.image}" alt="${item.title}" class="portfolio-image">
                <div class="portfolio-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <div class="portfolio-tags">
                        ${item.tags.map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                    <a href="${item.link}" target="_blank" class="view-project">View Project</a>
                </div>
            </div>
        `).join('');

        this.portfolioGrid.innerHTML = portfolioHTML;
        this.addEventListeners();
    }

    addEventListeners() {
        this.portfolioGrid.querySelectorAll('.portfolio-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.classList.add('hover');
            });

            item.addEventListener('mouseleave', () => {
                item.classList.remove('hover');
            });
        });
    }

    showError() {
        this.portfolioGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Unable to load portfolio items. Please try again later.</p>
            </div>
        `;
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        try {
            // Note: Replace with your actual form submission endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showSuccess();
                this.form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.showError();
        }
    }

    showSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Message sent successfully!</p>
        `;
        this.form.appendChild(successMessage);
        setTimeout(() => successMessage.remove(), 3000);
    }

    showError() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>Failed to send message. Please try again.</p>
        `;
        this.form.appendChild(errorMessage);
        setTimeout(() => errorMessage.remove(), 3000);
    }
}

// BlueSky Ticker
class BlueSkyTicker {
    constructor() {
        this.tickerContent = document.querySelector('.ticker-content');
        this.posts = [];
        this.init();
    }

    async init() {
        // Example posts for testing (replace with actual API call)
        this.posts = [
            {
                text: "Just finished a new 3D printed design! Can't wait to share it with everyone 🚀",
                timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
            },
            {
                text: "Working on some exciting IoT projects with Arduino and Raspberry Pi 🛠️",
                timestamp: new Date(Date.now() - 3600000) // 1 hour ago
            },
            {
                text: "New video tutorial on custom PCB design coming soon! 🔧",
                timestamp: new Date(Date.now() - 7200000) // 2 hours ago
            }
        ];

        this.renderTicker();
        this.startTickerAnimation();
    }

    formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return interval + 'y ago';
        
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return interval + 'mo ago';
        
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return interval + 'd ago';
        
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return interval + 'h ago';
        
        interval = Math.floor(seconds / 60);
        if (interval > 1) return interval + 'm ago';
        
        return Math.floor(seconds) + 's ago';
    }

    renderTicker() {
        this.tickerContent.innerHTML = this.posts.map(post => `
            <div class="ticker-item">
                <span class="ticker-timestamp">${this.formatTimeAgo(post.timestamp)}</span>
                <span class="ticker-text">${post.text}</span>
            </div>
        `).join('');

        // Clone items for seamless loop
        const items = this.tickerContent.innerHTML;
        this.tickerContent.innerHTML += items;
    }

    startTickerAnimation() {
        // Reset animation when it completes
        this.tickerContent.addEventListener('animationend', () => {
            this.tickerContent.style.animation = 'none';
            void this.tickerContent.offsetWidth; // Trigger reflow
            this.tickerContent.style.animation = null;
        });
    }
}

// Initialize integrations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShopHighlights();
    new BlueSkyFeed();
    new Portfolio();
    new ContactForm();
    new BlueSkyTicker();
}); 