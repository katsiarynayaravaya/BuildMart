let currentCart = [];
let discountApplied = false;
const PROMO_CODE = "BUILD10";
const DISCOUNT_RATE = 0.10;
const TAX_RATE = 0.08;
let productsData = [];

function loadCartPage() {
    const savedCart = localStorage.getItem('buildmart-cart');
    if (savedCart) {
        currentCart = JSON.parse(savedCart);
    } else {
        currentCart = [];
    }
    
    fetch('../data/products.json')
        .then(response => response.json())
        .then(products => {
            productsData = products;
            renderCartPage();
        })
        .catch(error => {
            console.error('Ошибка загрузки товаров:', error);
            renderCartPage();
        });
    
    updateCartCount();
}

function getProductCategory(productId) {
    const product = productsData.find(p => p.id === productId);
    return product ? product.category : 'Building Materials';
}

function renderCartPage() {
    const root = document.getElementById('cart-root');
    if (!root) return;
    
    if (!currentCart.length) {
        root.innerHTML = `
            <div class="empty-cart-container">
                <h1>Your Cart is Empty</h1>
                <p>Start shopping to add items to your cart</p>
                <a href="/index.html" class="browse-products-btn">
                    Browse Products
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </a>
            </div>
        `;
        return;
    }
    
    root.innerHTML = `
        <div class="cart-container">
            <h1 class="cart-title">Shopping Cart</h1>
            <div class="cart-layout">
                <div class="cart-left">
                    <div class="cart-items-wrapper">
                        <div class="cart-items-header">
                            <div class="col-product">Product</div>
                            <div class="col-price">Price</div>
                            <div class="col-quantity">Quantity</div>
                            <div class="col-total">Total</div>
                        </div>
                        <div class="cart-items-list" id="cart-items-list"></div>
                    </div>
                    <div class="promo-code-wrapper">
                        <h3>Have a promo code?</h3>
                        <div class="promo-input-group">
                            <input type="text" id="promo-input" placeholder="Enter promo code" maxlength="20">
                            <button id="apply-promo-btn">Apply</button>
                        </div>
                        <div class="promo-hint" id="promo-hint" style="display: none;">Try code: BUILD10 for 10% off</div>
                        <div class="promo-message" id="promo-message"></div>
                    </div>
                </div>
                <div class="cart-right">
                    <div class="order-summary-wrapper">
                        <div class="order-summary-sticky" id="order-summary-sticky">
                            <div class="order-summary">
                                <h2>Order Summary</h2>
                                <div class="summary-details">
                                    <div class="summary-row">
                                        <span>Subtotal</span>
                                        <span id="subtotal">$0.00</span>
                                    </div>
                                    <div class="summary-row">
                                        <span>Tax (8%)</span>
                                        <span id="tax">$0.00</span>
                                    </div>
                                    <div class="summary-row discount-row" id="discount-row" style="display: none;">
                                        <span>Discount (10%)</span>
                                        <span id="discount-amount" class="discount-value">-$0.00</span>
                                    </div>
                                </div>
                                <div class="summary-total">
                                    <span>Total</span>
                                    <span id="total">$0.00</span>
                                </div>
                                <button class="checkout-btn" id="checkout-btn">
                                    Proceed to Checkout
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M5 12h14"/>
                                        <path d="m12 5 7 7-7 7"/>
                                    </svg>
                                </button>
                                <a href="/index.html" class="continue-shopping-btn">Continue Shopping</a>
                            </div>
                        </div>
                        <div class="shipping-info">
                            <h3>Shipping Information</h3>
                            <div class="shipping-details">
                                <div class="shipping-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F54900" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>
                                    </svg>
                                    <div>
                                        <p>Estimated Delivery</p>
                                        <p>3-5 business days</p>
                                    </div>
                                </div>
                                <div class="shipping-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F54900" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <div>
                                        <p>Shipping Address</p>
                                        <p>123 Construction Ave<br>Builder City, BC 12345<br>United States</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    renderCartItems();
    initPromoCode();
    updateSummary();
    initStickyOrderSummary();
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {});
    }
}

function initStickyOrderSummary() {
    const orderSummary = document.getElementById('order-summary-sticky');
    const wrapper = document.querySelector('.order-summary-wrapper');
    if (!orderSummary || !wrapper) return;
    
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 81;
    const offset = headerHeight + 20;
    
    let originalTop = orderSummary.getBoundingClientRect().top + window.scrollY;
    let originalWidth = orderSummary.offsetWidth;
    let parentLeft = orderSummary.parentElement.getBoundingClientRect().left;
    let placeholder = null;
    let isActive = false;
    
    const footer = document.querySelector('.footer');
    const distanceFromFooter = 30;
    
    function createPlaceholder() {
        if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.style.height = orderSummary.offsetHeight + 'px';
            placeholder.style.width = '100%';
            placeholder.style.display = 'block';
            placeholder.style.visibility = 'hidden';
        }
    }
    
    function removePlaceholder() {
        if (placeholder && placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
            placeholder = null;
        }
    }
    
    function handleScroll() {
        const scrollPosition = window.scrollY;
        
        originalWidth = orderSummary.offsetWidth;
        parentLeft = orderSummary.parentElement.getBoundingClientRect().left;
        
        const footerRect = footer ? footer.getBoundingClientRect() : null;
        const footerTop = footerRect ? footerRect.top + scrollPosition : Infinity;
        const orderSummaryHeight = orderSummary.offsetHeight;
        
        const shouldStick = scrollPosition + offset > originalTop;
        const hitsFooter = scrollPosition + offset + orderSummaryHeight + distanceFromFooter > footerTop;
        
        if (shouldStick && !hitsFooter) {
            if (!isActive) {
                createPlaceholder();
                if (placeholder && !placeholder.parentNode) {
                    orderSummary.parentNode.insertBefore(placeholder, orderSummary);
                }
                isActive = true;
            }
            
            orderSummary.style.position = 'fixed';
            orderSummary.style.top = offset + 'px';
            orderSummary.style.width = originalWidth + 'px';
            orderSummary.style.left = parentLeft + 'px';
            orderSummary.style.zIndex = '100';
            
        } else if (shouldStick && hitsFooter) {
            if (!isActive) {
                createPlaceholder();
                if (placeholder && !placeholder.parentNode) {
                    orderSummary.parentNode.insertBefore(placeholder, orderSummary);
                }
                isActive = true;
            }
            
            orderSummary.style.position = 'absolute';
            orderSummary.style.top = (footerTop - orderSummaryHeight - distanceFromFooter - originalTop) + 'px';
            orderSummary.style.width = originalWidth + 'px';
            orderSummary.style.left = '0';
            orderSummary.style.zIndex = '100';
            
        } else {
            if (isActive) {
                removePlaceholder();
                isActive = false;
            }
            
            orderSummary.style.position = '';
            orderSummary.style.top = '';
            orderSummary.style.width = '';
            orderSummary.style.left = '';
            orderSummary.style.zIndex = '';
        }
    }
    
    window.addEventListener('resize', () => {
        originalTop = orderSummary.getBoundingClientRect().top + window.scrollY;
        originalWidth = orderSummary.offsetWidth;
        parentLeft = orderSummary.parentElement.getBoundingClientRect().left;
        
        if (placeholder) {
            placeholder.style.height = orderSummary.offsetHeight + 'px';
        }
        
        orderSummary.style.position = '';
        orderSummary.style.top = '';
        orderSummary.style.width = '';
        orderSummary.style.left = '';
        isActive = false;
        removePlaceholder();
        
        setTimeout(handleScroll, 10);
    });
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

function renderCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    if (!cartItemsList) return;
    
    cartItemsList.innerHTML = currentCart.map(item => {
        const category = getProductCategory(item.id);
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-product">
                    <div class="cart-item-image">
                        <a href="product.html?id=${item.id}">
                            <img src="${item.image}" alt="${item.name}">
                        </a>
                    </div>
                    <div class="cart-item-info">
                        <a href="product.html?id=${item.id}" class="cart-item-name">${item.name}</a>
                        <span class="cart-item-category">${category}</span>
                        <div class="cart-item-remove-mobile">
                            <button class="remove-item-btn" data-id="${item.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E7000B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    <line x1="10" x2="10" y1="11" y2="17"></line>
                                    <line x1="14" x2="14" y1="11" y2="17"></line>
                                </svg>
                                <span class="remove-text">Remove</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <div class="quantity-control">
                        <button class="qty-minus" data-id="${item.id}">−</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="qty-plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item-btn" data-id="${item.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E7000B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            <line x1="10" x2="10" y1="11" y2="17"></line>
                            <line x1="14" x2="14" y1="11" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', () => updateItemQuantity(parseInt(btn.dataset.id), -1));
    });
    
    document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', () => updateItemQuantity(parseInt(btn.dataset.id), 1));
    });
    
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', () => removeItem(parseInt(btn.dataset.id)));
    });
}
function updateItemQuantity(productId, delta) {
    const item = currentCart.find(i => i.id === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
        removeItem(productId);
    } else {
        item.quantity = newQuantity;
        saveCartToLocalStorage();
        renderCartItems();
        updateSummary();
        updateCartCount();
    }
}

function removeItem(productId) {
    currentCart = currentCart.filter(i => i.id !== productId);
    saveCartToLocalStorage();
    
    if (currentCart.length === 0) {
        renderCartPage();
    } else {
        renderCartItems();
        updateSummary();
    }
    updateCartCount();
}

function saveCartToLocalStorage() {
    localStorage.setItem('buildmart-cart', JSON.stringify(currentCart));
}

function updateSummary() {
    const subtotal = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const tax = subtotal * TAX_RATE;
    
    let discount = 0;
    let total = subtotal + tax;
    
    if (discountApplied) {
        discount = subtotal * DISCOUNT_RATE;
        total = subtotal + tax - discount;
    }
    
    const subtotalElement = document.getElementById('subtotal');
    const discountRow = document.getElementById('discount-row');
    const discountAmountElement = document.getElementById('discount-amount');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    
    if (discountApplied && discountRow) {
        discountRow.style.display = 'flex';
        if (discountAmountElement) discountAmountElement.textContent = `-$${discount.toFixed(2)}`;
    } else if (discountRow) {
        discountRow.style.display = 'none';
    }
    
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

function initPromoCode() {
    const promoInput = document.getElementById('promo-input');
    const promoMessage = document.getElementById('promo-message');
    const promoHint = document.getElementById('promo-hint');
    const applyBtn = document.getElementById('apply-promo-btn');
    
    if (!promoInput) return;
    
    function updateHint() {
        if (!promoHint) return;
        const value = promoInput.value.trim().toUpperCase();
        
        if (discountApplied) {
            promoHint.style.display = 'none';
            return;
        }
        
        if (value === '') {
            promoHint.style.display = 'none';
        } 
        else if (value === PROMO_CODE) {
            promoHint.style.display = 'none';
        }
        else {
            promoHint.style.display = 'block';
            promoHint.textContent = 'Try code: BUILD10 for 10% off';
            promoHint.classList.remove('success', 'error');
        }
    }
    
    promoInput.addEventListener('input', updateHint);
    
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toUpperCase();
            
            if (discountApplied) {
                promoMessage.textContent = '✓ Promo code already applied!';
                promoMessage.classList.add('success');
                promoMessage.classList.remove('error');
                if (promoHint) promoHint.style.display = 'none';
                return;
            }
            
            if (code === PROMO_CODE) {
                discountApplied = true;
                promoMessage.textContent = '✓ Promo code applied! You saved 10%';
                promoMessage.classList.add('success');
                promoMessage.classList.remove('error');
                if (promoHint) promoHint.style.display = 'none';
                updateSummary();
            } else {
                promoMessage.textContent = 'Invalid promo code. Try: BUILD10';
                promoMessage.classList.add('error');
                promoMessage.classList.remove('success');
            }
        });
    }
}

function updateCartCount() {
    const cartCountElement = document.querySelector('.cart__count');
    if (cartCountElement) {
        const totalItems = currentCart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.visibility = 'visible';
        } else {
            cartCountElement.style.visibility = 'hidden';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCartPage();
});