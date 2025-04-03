# Ko-Fi Shop Integration Guide

This guide explains how to integrate Ko-Fi shop products into your website using JavaScript.

## Prerequisites

- A Ko-Fi account with shop items
- Basic knowledge of HTML, CSS, and JavaScript
- A web server to host your website (not a local file system)

## Implementation Steps

### 1. HTML Structure

Create a container for your shop items:

```html
<div class="shop-grid" id="shop-items">
    <div class="loading">
        <i class="fas fa-spinner fa-spin fa-3x"></i>
        <p>Loading shop items...</p>
    </div>
</div>
```

### 2. JavaScript Implementation

#### Ko-Fi API Integration

```javascript
class ShopManager {
    constructor() {
        this.shopContainer = document.getElementById('shop-items');
        this.currentCategory = 'all';
        this.items = [];
        this.init();
    }

    async init() {
        this.addEventListeners();
        await this.fetchItems();
    }

    async fetchItems(category = '') {
        try {
            this.showLoading();
            
            // Replace 'YOUR_KOFI_ID' with your actual Ko-Fi shop ID
            let targetUrl = `https://ko-fi.com/shop/YOUR_KOFI_ID/items/0/100?productType=0`;
            
            if (category && category !== 'all') {
                targetUrl = `https://ko-fi.com/shop/YOUR_KOFI_ID/items/0/100?productType=0&category=${category}`;
            }
            
            // CORS proxies (required when accessing Ko-Fi API from browser)
            const corsProxies = [
                'https://corsproxy.io/?',
                'https://api.allorigins.win/get?url='
            ];
            
            let data = null;
            let lastError = null;
            
            // Try each proxy until one works
            for (const proxy of corsProxies) {
                try {
                    const apiUrl = proxy + encodeURIComponent(targetUrl);
                    
                    const response = await fetch(apiUrl, {
                        headers: {
                            'accept': 'application/json, text/javascript, */*; q=0.01',
                            'x-requested-with': 'XMLHttpRequest'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Failed with status: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    
                    // Handle different response formats
                    if (proxy === 'https://api.allorigins.win/get?url=') {
                        if (result && result.contents) {
                            data = JSON.parse(result.contents);
                        } else {
                            throw new Error('Invalid response format from AllOrigins');
                        }
                    } else {
                        data = result;
                    }
                    
                    if (data) break;
                } catch (proxyError) {
                    lastError = proxyError;
                }
            }
            
            if (!data) {
                throw new Error(lastError ? lastError.message : 'All proxies failed');
            }
            
            this.items = data || [];
            this.renderItems();
        } catch (error) {
            this.showError(`
                <h3>Unable to fetch items from Ko-Fi</h3>
                <p>The API may be unavailable or have CORS restrictions.</p>
                <p>Please try again later or visit the Ko-Fi shop directly:</p>
                <p><a href="https://ko-fi.com/YOUR_USERNAME/shop" target="_blank">Visit Ko-Fi Shop</a></p>
                <p><small>Error details: ${error.message}</small></p>
            `);
        }
    }

    renderItems() {
        if (!this.items || this.items.length === 0) {
            this.shopContainer.innerHTML = `
                <div class="error-message">
                    <p>No items found in this category.</p>
                </div>
            `;
            return;
        }
        
        const itemsHTML = this.items.map(item => {
            // Handle image URL formatting
            let imageUrl = 'path/to/placeholder.png';
            if (item.ThumbnailUrls && item.ThumbnailUrls.length > 0) {
                if (item.ThumbnailUrls[0].startsWith('http')) {
                    imageUrl = item.ThumbnailUrls[0];
                } else {
                    imageUrl = `https://storage.ko-fi.com/cdn/useruploads/display/${item.ThumbnailUrls[0]}`;
                }
            }
            
            // Handle sold-out status
            const soldOutBadge = item.IsSoldOut ? 
                `<div class="sold-out-badge">Sold Out</div>` : 
                (item.ItemsAvailable && item.ItemsAvailable < 3 ? 
                    `<div class="limited-badge">Only ${item.ItemsAvailable} left!</div>` : '');
            
            return `
                <div class="shop-item ${item.IsSoldOut ? 'sold-out' : ''}">
                    ${soldOutBadge}
                    <a href="https://ko-fi.com/s/${item.Alias}" target="_blank" class="shop-item-image-link">
                        <img src="${imageUrl}" alt="${item.Name}" class="shop-item-image">
                    </a>
                    <div class="shop-item-info">
                        <h3 class="shop-item-title">
                            <a href="https://ko-fi.com/s/${item.Alias}" target="_blank">
                                ${item.Name}
                            </a>
                        </h3>
                        <p class="shop-item-description">${item.Description || 'No description available'}</p>
                        <p class="shop-item-price">${this.formatPrice(item.Price)}</p>
                        <a href="https://ko-fi.com/s/${item.Alias}" target="_blank" class="shop-item-button">
                            ${item.IsSoldOut ? 'View Details' : 'Purchase'}
                        </a>
                    </div>
                </div>
            `;
        }).join('');
        
        this.shopContainer.innerHTML = itemsHTML;
    }

    formatPrice(price) {
        if (!price) return 'Price not available';
        
        if (typeof price === 'number') {
            return `$${price.toFixed(2)}`;
        } else if (typeof price === 'string') {
            if (price.includes('$')) return price;
            
            const numPrice = parseFloat(price);
            if (!isNaN(numPrice)) {
                return `$${numPrice.toFixed(2)}`;
            }
            
            return price;
        }
        
        return 'Price not available';
    }

    showLoading() {
        this.shopContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin fa-3x"></i>
                <p>Loading shop items...</p>
            </div>
        `;
    }

    showError(message) {
        this.shopContainer.innerHTML = `
            <div class="error-message">
                <div>${message}</div>
            </div>
        `;
    }
}

// Initialize the shop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const shopManager = new ShopManager();
});
```

### 3. Adding Category Filters (Optional)

Create category buttons in your HTML:

```html
<div class="category-filters">
    <button class="category-btn active" data-category="all">All Items</button>
    <button class="category-btn" data-category="category1">Category 1</button>
    <button class="category-btn" data-category="category2">Category 2</button>
</div>
```

Add to your ShopManager class:

```javascript
addEventListeners() {
    // Category buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            this.filterItems(category);
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

filterItems(category) {
    this.currentCategory = category;
    this.fetchItems(category);
}
```

### 4. Highlighting Featured Items (Optional)

To highlight a specific featured item when displaying all items:

```javascript
renderItems() {
    // ... existing code
    
    // Define the featured item alias - this is the Ko-Fi product ID
    const featuredItemAlias = 'YOUR_FEATURED_ITEM_ID';
    
    // If we're in "All Items" category, move the featured item to the top
    if (this.currentCategory === 'all') {
        // Find the featured item
        const featuredItemIndex = this.items.findIndex(item => item.Alias === featuredItemAlias);
        
        // If found, move it to the beginning of the array
        if (featuredItemIndex !== -1) {
            const featuredItem = this.items.splice(featuredItemIndex, 1)[0];
            this.items.unshift(featuredItem);
        }
    }
    
    // Within the mapping function, add:
    const isFeaturedItem = this.currentCategory === 'all' && 
                         item.Alias === featuredItemAlias;
    
    // Add featured class and badge
    const featuredClass = isFeaturedItem ? 'featured' : '';
    const featuredBadge = isFeaturedItem ? 
        `<div class="featured-badge">Featured Item</div>` : '';
    
    // Add to the shop-item div:
    <div class="shop-item ${item.IsSoldOut ? 'sold-out' : ''} ${featuredClass}">
        ${soldOutBadge}
        ${featuredBadge}
        // ... rest of the item HTML
    </div>
}
```

## Common Issues and Solutions

### CORS Issues

Ko-Fi's API is not configured to allow direct cross-origin requests from browsers. This is why we use CORS proxies in the implementation. If one proxy fails, the code will try the next one.

### Handling Images

Ko-Fi product images may come in different formats:
- Some as full URLs
- Some as just filenames

The code handles both cases by checking if the image URL starts with 'http' and constructs the full URL if needed.

### Customization

- To change the appearance of shop items, use CSS to style the `.shop-item` class and its children
- For different layouts, adjust the grid settings in your CSS
- Ensure mobile responsiveness by using media queries

## Resources

- [Ko-Fi Developer Documentation](https://ko-fi.com/manage/developer)
- [CORS Proxies Information](https://github.com/Rob--W/cors-anywhere/wiki)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 