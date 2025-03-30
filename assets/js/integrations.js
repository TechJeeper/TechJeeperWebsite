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
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkN1c3RvbSBKZWVwIERlc2lnbiBULVNoaXJ0PC90ZXh0Pjwvc3ZnPg==',
                title: 'Custom Jeep Design T-Shirt',
                description: 'Limited edition off-road inspired design',
                price: '$24.99',
                link: 'https://ko-fi.com/techjeeper/shop'
            },
            {
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFkdmVudHVyZSBTdGlja2VyIFBhY2s8L3RleHQ+PC9zdmc+',
                title: 'Adventure Sticker Pack',
                description: 'Set of 5 waterproof vinyl stickers',
                price: '$12.99',
                link: 'https://ko-fi.com/techjeeper/shop'
            },
            {
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRpZ2l0YWwgQXJ0IFByaW50PC90ZXh0Pjwvc3ZnPg==',
                title: 'Digital Art Print',
                description: 'High-quality 12x18 print',
                price: '$19.99',
                link: 'https://ko-fi.com/techjeeper/shop'
            }
        ];
        
        this.renderSlider();
        this.addEventListeners();
    }

    handleImageError(img) {
        img.onerror = null; // Prevent infinite loop
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIENvbWluZyBTb29uPC90ZXh0Pjwvc3ZnPg==';
    }

    renderSlider() {
        const itemsHTML = this.items.map((item, index) => `
            <div class="featured-item ${index === 0 ? 'active' : ''}">
                <img src="${item.image}" alt="${item.title}" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIENvbWluZyBTb29uPC90ZXh0Pjwvc3ZnPg==';">
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
                    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRKPC90ZXh0Pjwvc3ZnPg=='
                },
                text: 'Just launched my new custom Jeep design collection! Check it out in the shop 🚙✨',
                createdAt: new Date(),
                images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkplZXAgRGVzaWduIENvbGxlY3Rpb248L3RleHQ+PC9zdmc+'],
                likes: 42,
                reposts: 12
            },
            {
                author: {
                    name: 'TechJeeper',
                    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRKPC90ZXh0Pjwvc3ZnPg=='
                },
                text: 'Working on some exciting new digital art pieces. Stay tuned! 🎨',
                createdAt: new Date(Date.now() - 86400000),
                images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRpZ2l0YWwgQXJ0IFByZXZpZXc8L3RleHQ+PC9zdmc+'],
                likes: 38,
                reposts: 8
            },
            {
                author: {
                    name: 'TechJeeper',
                    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRKPC90ZXh0Pjwvc3ZnPg=='
                },
                text: 'New sticker designs dropping next week! Which is your favorite? 🌟',
                createdAt: new Date(Date.now() - 172800000),
                images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlN0aWNrZXIgRGVzaWduczwvdGV4dD48L3ZnPg=='],
                likes: 56,
                reposts: 15
            }
        ];
        
        this.renderHighlights();
        this.renderFeed(this.highlights);
        this.addEventListeners();
    }

    renderHighlights() {
        const highlightsHTML = this.highlights.map((post, index) => `
            <div class="featured-post ${index === 0 ? 'active' : ''}">
                <div class="featured-post-header">
                    <img src="${post.author.avatar}" alt="${post.author.name}" class="featured-post-avatar" 
                        onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRKPC90ZXh0Pjwvc3ZnPg==';">
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
                    <img src="${image}" alt="Post image" class="post-image" 
                        onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIENvbWluZyBTb29uPC90ZXh0Pjwvc3ZnPg==';">
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
        this.container = document.querySelector('.portfolio-grid');
        this.init();
    }

    init() {
        if (!this.container) return;
        this.renderItems();
    }

    renderItems() {
        // Static portfolio items instead of API call
        const items = [
            {
                title: 'Project 1',
                description: 'Description of project 1',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2plY3QgMTwvdGV4dD48L3N2Zz4=',
                link: '#'
            },
            {
                title: 'Project 2',
                description: 'Description of project 2',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2plY3QgMjwvdGV4dD48L3N2Zz4=',
                link: '#'
            },
            {
                title: 'Project 3',
                description: 'Description of project 3',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEyQTJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwQkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2plY3QgMzwvdGV4dD48L3N2Zz4=',
                link: '#'
            }
        ];

        this.container.innerHTML = items.map(item => `
            <div class="portfolio-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="portfolio-item-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <a href="${item.link}" class="portfolio-item-link">View Project</a>
                </div>
            </div>
        `).join('');
    }
}

// Initialize integrations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize shop highlights
    const shopHighlights = new ShopHighlights();
    
    // Initialize BlueSky feed
    const blueskyFeed = new BlueSkyFeed();
    
    // Initialize portfolio
    const portfolio = new Portfolio();
    
    // Re-initialize content when sections become active
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Re-initialize content when section becomes visible
                    switch(section.id) {
                        case 'shop':
                            shopHighlights.init();
                            break;
                        case 'bluesky':
                            blueskyFeed.init();
                            break;
                        case 'portfolio':
                            portfolio.init();
                            break;
                    }
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(section);
    });
}); 