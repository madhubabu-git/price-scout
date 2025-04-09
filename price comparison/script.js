// DOM Elements
const searchForm = document.getElementById('search-form');
const searchQuery = document.getElementById('search-query');
const searchResults = document.getElementById('search-results');
const emptyResults = document.getElementById('empty-results');
const loadingState = document.getElementById('loading-state');
const searchTerm = document.getElementById('search-term');
const resultCount = document.getElementById('result-count');
const platformCount = document.getElementById('platform-count');
const avgPlatformCount = document.getElementById('avg-platform-count');
const resultsContainer = document.getElementById('results-container');
const sortOptions = document.getElementById('sort-options');
const lowestPrice = document.getElementById('lowest-price');
const lowestPlatform = document.getElementById('lowest-platform');
const lowestPlatformIcon = document.getElementById('lowest-platform-icon');
const lowestShipping = document.getElementById('lowest-shipping');
const averagePrice = document.getElementById('average-price');
const highestPrice = document.getElementById('highest-price');
const highestPlatform = document.getElementById('highest-platform');
const highestPlatformIcon = document.getElementById('highest-platform-icon');
const highestShipping = document.getElementById('highest-shipping');
const loadMoreBtn = document.getElementById('load-more');
const clearSearchBtn = document.getElementById('clear-search');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const authModal = document.getElementById('auth-modal');
const closeModal = document.querySelector('.close-modal');
const authTabs = document.querySelectorAll('.auth-tab');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const currentYear = document.getElementById('current-year');
const popularProductCards = document.querySelectorAll('.product-card');

// Templates
const priceCardTemplate = document.getElementById('price-card-template');
const priceItemTemplate = document.getElementById('price-item-template');

// Set current year in footer
currentYear.textContent = new Date().getFullYear();

// Global state
let currentUser = null;
let currentProducts = [];
let displayedProducts = [];
let visibleCount = 5; // Number of products to show initially

// Product search functionality
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchQuery.value.trim();
  
  if (query.length === 0) return;
  
  // Show loading state
  document.querySelector('.hero').style.display = 'none';
  document.querySelector('.how-it-works').style.display = 'none';
  document.querySelector('.popular-products').style.display = 'none';
  searchResults.style.display = 'none';
  emptyResults.style.display = 'none';
  loadingState.style.display = 'block';

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock data
    const products = generateMockProducts(query);
    
    // Update UI with results
    displaySearchResults(query, products);
  } catch (error) {
    console.error('Error searching products:', error);
    // Show error state
    loadingState.style.display = 'none';
    emptyResults.style.display = 'block';
  }
});

// Handle popular product cards
popularProductCards.forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    const query = card.getAttribute('data-query');
    searchQuery.value = query;
    searchForm.dispatchEvent(new Event('submit'));
  });
});

// Handle sort options
sortOptions.addEventListener('change', () => {
  const sortValue = sortOptions.value;
  sortAndDisplayProducts(sortValue);
});

// Clear search button
clearSearchBtn.addEventListener('click', () => {
  // Reset the UI
  searchQuery.value = '';
  searchResults.style.display = 'none';
  emptyResults.style.display = 'none';
  document.querySelector('.hero').style.display = 'block';
  document.querySelector('.how-it-works').style.display = 'block';
  document.querySelector('.popular-products').style.display = 'block';
});

// Load more button
loadMoreBtn.addEventListener('click', () => {
  visibleCount += 5;
  updateVisibleProducts();
});

// Authentication modal
loginButton.addEventListener('click', (e) => {
  e.preventDefault();
  authModal.style.display = 'flex';
  setActiveTab('login');
});

registerButton.addEventListener('click', (e) => {
  e.preventDefault();
  authModal.style.display = 'flex';
  setActiveTab('register');
});

closeModal.addEventListener('click', () => {
  authModal.style.display = 'none';
});

authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    setActiveTab(tab.getAttribute('data-tab'));
  });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.style.display = 'none';
  }
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  
  // Simulate login (in a real app, this would be an API call)
  simulateLogin(username, password);
});

// Register form submission
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (password !== confirmPassword) {
    alert("Passwords don't match!");
    return;
  }
  
  // Simulate registration (in a real app, this would be an API call)
  simulateRegistration(username, password);
});

// Mobile menu toggle
const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
const navMenu = document.querySelector('nav ul');

mobileMenuIcon.addEventListener('click', () => {
  navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

// Function to set active tab in auth modal
function setActiveTab(tabName) {
  authTabs.forEach(tab => {
    if (tab.getAttribute('data-tab') === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  if (tabName === 'login') {
    loginTab.style.display = 'block';
    registerTab.style.display = 'none';
  } else {
    loginTab.style.display = 'none';
    registerTab.style.display = 'block';
  }
}

// Function to display search results
function displaySearchResults(query, products) {
  // Hide loading state
  loadingState.style.display = 'none';
  
  // Update search term display
  searchTerm.textContent = query;
  
  // If no results, show empty state
  if (products.length === 0) {
    emptyResults.style.display = 'block';
    return;
  }
  
  // Store products in global state
  currentProducts = products;
  
  // Update result count
  resultCount.textContent = products.length;
  
  // Get all unique platforms
  const platforms = new Set();
  products.forEach(product => {
    product.prices.forEach(price => {
      platforms.add(price.platform);
    });
  });
  
  // Update platform count
  platformCount.textContent = platforms.size;
  avgPlatformCount.textContent = platforms.size;
  
  // Calculate price summary
  const priceSummary = calculatePriceSummary(products);
  
  // Update price summary UI
  lowestPrice.textContent = formatPrice(priceSummary.lowestPrice.price);
  lowestPlatform.textContent = priceSummary.lowestPrice.platform;
  lowestPlatformIcon.className = `fab ${getPlatformIcon(priceSummary.lowestPrice.platform)}`;
  lowestShipping.textContent = priceSummary.lowestPrice.shipping === 0 ? 'Free shipping' : `+ ${formatPrice(priceSummary.lowestPrice.shipping)} shipping`;
  
  averagePrice.textContent = formatPrice(priceSummary.averagePrice);
  
  highestPrice.textContent = formatPrice(priceSummary.highestPrice.price);
  highestPlatform.textContent = priceSummary.highestPrice.platform;
  highestPlatformIcon.className = `fab ${getPlatformIcon(priceSummary.highestPrice.platform)}`;
  highestShipping.textContent = priceSummary.highestPrice.shipping === 0 ? 'Free shipping' : `+ ${formatPrice(priceSummary.highestPrice.shipping)} shipping`;
  
  // Sort and display products
  sortAndDisplayProducts(sortOptions.value);
  
  // Show results
  searchResults.style.display = 'block';
}

// Function to sort and display products
function sortAndDisplayProducts(sortOption) {
  // Clone products array
  const sortedProducts = [...currentProducts];
  
  // Sort based on option
  switch (sortOption) {
    case 'price-asc':
      sortedProducts.sort((a, b) => {
        const aPrice = a.prices.find(p => p.isLowest)?.price || a.prices[0].price;
        const bPrice = b.prices.find(p => p.isLowest)?.price || b.prices[0].price;
        return aPrice - bPrice;
      });
      break;
    case 'price-desc':
      sortedProducts.sort((a, b) => {
        const aPrice = a.prices.find(p => p.isLowest)?.price || a.prices[0].price;
        const bPrice = b.prices.find(p => p.isLowest)?.price || b.prices[0].price;
        return bPrice - aPrice;
      });
      break;
    case 'rating':
      sortedProducts.sort((a, b) => b.rating - a.rating);
      break;
  }
  
  displayedProducts = sortedProducts;
  updateVisibleProducts();
}

// Update visible products
function updateVisibleProducts() {
  // Clear previous results
  resultsContainer.innerHTML = '';
  
  // Get visible products
  const visibleProducts = displayedProducts.slice(0, visibleCount);
  
  // Create product cards
  visibleProducts.forEach(product => {
    const card = createProductCard(product);
    resultsContainer.appendChild(card);
  });
  
  // Show/hide load more button
  if (visibleProducts.length < displayedProducts.length) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
}

// Create product card
function createProductCard(product) {
  // Clone template
  const template = priceCardTemplate.content.cloneNode(true);
  
  // Set product details
  template.querySelector('.product-title').textContent = product.title;
  
  // Set rating
  const starsContainer = template.querySelector('.stars');
  starsContainer.innerHTML = generateStarRating(product.rating);
  template.querySelector('.review-count').textContent = `(${product.reviewCount} reviews)`;
  
  // Create price items
  const pricesList = template.querySelector('.prices-list');
  
  product.prices.forEach(price => {
    const priceItem = createPriceItem(price);
    pricesList.appendChild(priceItem);
  });
  
  return template;
}

// Create price item
function createPriceItem(price) {
  // Clone template
  const template = priceItemTemplate.content.cloneNode(true);
  
  // Set platform details
  template.querySelector('.platform-name').textContent = price.platform;
  const iconElement = template.querySelector('.platform-icon');
  iconElement.className = `fab ${getPlatformIcon(price.platform)}`;
  
  // Set price details
  const priceValue = template.querySelector('.price-value');
  priceValue.textContent = formatPrice(price.price);
  
  if (price.isLowest) {
    priceValue.classList.add('lowest');
  } else if (price.isHighest) {
    priceValue.classList.add('highest');
  }
  
  // Set shipping info
  template.querySelector('.shipping-info').textContent = price.shipping === 0 
    ? 'Free shipping' 
    : `+ ${formatPrice(price.shipping)} shipping`;
  
  // Set visit store link
  template.querySelector('.btn-visit').href = price.url;
  
  return template;
}

// Generate star rating HTML
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  let html = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fas fa-star"></i>';
  }
  
  // Half star
  if (halfStar) {
    html += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    html += '<i class="far fa-star"></i>';
  }
  
  return html;
}

// Get platform icon class
function getPlatformIcon(platform) {
  const lowerPlatform = platform.toLowerCase();
  
  if (lowerPlatform.includes('amazon')) {
    return 'fa-amazon';
  }
  
  if (lowerPlatform.includes('flipkart')) {
    return 'fa-shopping-cart';
  }
  
  if (lowerPlatform.includes('ebay')) {
    return 'fa-ebay';
  }
  
  if (lowerPlatform.includes('best buy')) {
    return 'fa-shopping-cart';
  }
  
  if (lowerPlatform.includes('reliance')) {
    return 'fa-shopping-cart';
  }
  
  // Default
  return 'fa-store';
}

// Format price as currency
function formatPrice(price) {
  // Convert USD to INR (approximate rate)
  const inrPrice = price * 83;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(inrPrice);
}

// Calculate price summary
function calculatePriceSummary(products) {
  let platforms = new Set();
  let lowestPriceItem = { price: Infinity, platform: '', shipping: 0 };
  let highestPriceItem = { price: -Infinity, platform: '', shipping: 0 };
  let totalPrice = 0;
  let priceCount = 0;
  
  products.forEach(product => {
    product.prices.forEach(price => {
      platforms.add(price.platform);
      totalPrice += price.price;
      priceCount++;
      
      if (price.price < lowestPriceItem.price) {
        lowestPriceItem = {
          price: price.price,
          platform: price.platform,
          shipping: price.shipping
        };
      }
      
      if (price.price > highestPriceItem.price) {
        highestPriceItem = {
          price: price.price,
          platform: price.platform,
          shipping: price.shipping
        };
      }
    });
  });
  
  return {
    lowestPrice: lowestPriceItem,
    highestPrice: highestPriceItem,
    averagePrice: totalPrice / priceCount,
    platformCount: platforms.size
  };
}

// Simulate login
function simulateLogin(username, password) {
  // In a real app, this would validate credentials with an API
  setTimeout(() => {
    currentUser = { username };
    updateAuthUI();
    authModal.style.display = 'none';
    alert(`Welcome back, ${username}!`);
  }, 1000);
}

// Simulate registration
function simulateRegistration(username, password) {
  // In a real app, this would create a user account via an API
  setTimeout(() => {
    currentUser = { username };
    updateAuthUI();
    authModal.style.display = 'none';
    alert(`Account created successfully. Welcome, ${username}!`);
  }, 1000);
}

// Update auth UI based on login state
function updateAuthUI() {
  if (currentUser) {
    loginButton.textContent = currentUser.username;
    registerButton.textContent = 'Logout';
    registerButton.addEventListener('click', (e) => {
      e.preventDefault();
      currentUser = null;
      updateAuthUI();
    });
  } else {
    loginButton.textContent = 'Login';
    registerButton.textContent = 'Register';
    // Reset event listeners
    loginButton.replaceWith(loginButton.cloneNode(true));
    registerButton.replaceWith(registerButton.cloneNode(true));
    // Reattach event listeners
    document.getElementById('login-button').addEventListener('click', (e) => {
      e.preventDefault();
      authModal.style.display = 'flex';
      setActiveTab('login');
    });
    document.getElementById('register-button').addEventListener('click', (e) => {
      e.preventDefault();
      authModal.style.display = 'flex';
      setActiveTab('register');
    });
  }
}

// Generate mock products based on search query
function generateMockProducts(query) {
  const products = [];
  
  // Number of products to generate (varies slightly by query to seem realistic)
  const productCount = Math.max(1, Math.min(10, 3 + Math.floor(query.length / 3)));
  
  for (let i = 0; i < productCount; i++) {
    const prices = generatePricesForProduct(query, i);
    
    // Find lowest and highest price
    let minPrice = Number.MAX_VALUE;
    let maxPrice = Number.MIN_VALUE;
    let minIndex = 0;
    let maxIndex = 0;
    
    prices.forEach((price, index) => {
      if (price.price < minPrice) {
        minPrice = price.price;
        minIndex = index;
      }
      if (price.price > maxPrice) {
        maxPrice = price.price;
        maxIndex = index;
      }
    });
    
    // Mark lowest and highest prices
    prices[minIndex].isLowest = true;
    prices[maxIndex].isHighest = true;
    
    // Generate a product with these prices
    products.push({
      id: generateId(),
      title: generateProductTitle(query, i),
      image: undefined, // We're not actually fetching images
      rating: 3.5 + Math.random() * 1.5, // Random rating between 3.5 and 5.0
      reviewCount: Math.floor(100 + Math.random() * 2000), // Random review count
      prices
    });
  }
  
  return products;
}

// Generate prices for a product
function generatePricesForProduct(query, productIndex) {
  // Specified e-commerce platforms
  const platforms = ['Amazon', 'Flipkart', 'Reliance Digital', 'Chroma'];
  
  // Base price determined by query and product index
  // We use the length and character code of the query to make it deterministic but different
  const basePrice = 100 + 
    query.length * 10 + 
    query.charCodeAt(0) * 5 + 
    productIndex * 50;
  
  // Generate prices for different platforms with variation
  const prices = [];
  
  // Always show prices from all specified platforms
  const platformsToShow = platforms;
  
  platformsToShow.forEach(platform => {
    // Add platform-specific price variations
    let variation;
    switch(platform) {
      case 'Amazon':
        variation = (Math.random() * 0.15 - 0.05) * basePrice; // -5% to +10%
        break;
      case 'Flipkart':
        variation = (Math.random() * 0.2 - 0.1) * basePrice; // -10% to +10%
        break;
      case 'Reliance Digital':
        variation = (Math.random() * 0.25 - 0.15) * basePrice; // -15% to +10%
        break;
      case 'Chroma':
        variation = (Math.random() * 0.2 - 0.12) * basePrice; // -12% to +8%
        break;
      default:
        variation = (Math.random() * 0.2 - 0.1) * basePrice;
    }
    
    let price = Math.round((basePrice + variation) / 10) * 10 - 0.01;
    if (price < 10) price = 9.99;
    
    // Platform-specific shipping logic
    let shipping = 0;
    if (platform === 'Flipkart' || platform === 'Amazon') {
      shipping = price >= 500 ? 0 : Math.floor(Math.random() * 10) + 5;
    } else {
      shipping = Math.floor(Math.random() * 15) + 10;
    }
    
    // Generate platform-specific URLs
    let url;
    const searchQuery = encodeURIComponent(query);
    
    switch(platform) {
      case 'Amazon':
        url = `https://www.amazon.in/s?k=${searchQuery}`;
        break;
      case 'Flipkart':
        url = `https://www.flipkart.com/search?q=${searchQuery}`;
        break;
      case 'Reliance Digital':
        url = `https://www.reliancedigital.in/search?q=${searchQuery}`;
        break;
      case 'Chroma':
        url = `https://www.croma.com/searchB?q=${searchQuery}`;
        break;
      default:
        url = '#';
    }
    
    prices.push({
      platform,
      price,
      shipping,
      url
    })
  });
  
  return prices;
}

// Generate product title
function generateProductTitle(query, index) {
  // Generate a realistic product title based on the search query
  const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'Nike', 'Adidas', 'Dell', 'HP', 'Lenovo', 'Asus'];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  
  const adjectives = ['New', 'Premium', 'Ultra', 'Pro', 'Deluxe', 'Advanced', 'Elite', 'Ultimate'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  
  const year = 2022 + Math.floor(Math.random() * 3);
  
  // If query contains numbers, keep them for model numbers
  const numbers = query.match(/\d+/g);
  const modelNumber = numbers ? numbers[0] : (Math.floor(Math.random() * 10) + 1).toString();
  
  // Make different variants for each index
  const variant = ['', '(Latest Model)', 'Special Edition', 'Limited Edition', 'Plus'][index % 5];
  
  return `${brand} ${adjective} ${query.toUpperCase()} ${modelNumber} (${year}) ${variant}`.trim();
}

// Generate random ID
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}