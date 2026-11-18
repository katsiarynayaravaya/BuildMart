let currentCartItems = [];
let promoData = null;
const TAX_RATE = 0.08;

async function loadCartPage() {
    const root = document.getElementById('cart-root');
    if (!root) return;

    if (!getToken()) {
        root.innerHTML = `
            <div class="empty-cart-container">
                <h1>Please Sign In</h1>
                <p>You need to be logged in to view your shopping cart</p>
                <button onclick="openAuthModal()" class="browse-products-btn" style="border:none; cursor:pointer;">Sign In</button>
            </div>
        `;
        return;
    }

    try {
        const cartData = await apiRequest('/cart');
        currentCartItems = cartData.items || [];
        renderCartPage();
        updateCartCount();
    } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
    }
}

function renderCartPage() {
    const root = document.getElementById('cart-root');
    if (!root) return;
    
    if (!currentCartItems.length) {
        root.innerHTML = `
            <div class="empty-cart-container">
                <h1>Your Cart is Empty</h1>
                <p>Start shopping to add items to your cart</p>
                <a href="/index.html" class="browse-products-btn">Browse Products</a>
            </div>
        `;
        return;
    }
    
    // Вставляем твой HTML-шаблон корзины (без изменений)
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
                            <input type="text" id="promo-input" placeholder="Enter promo code (e.g. SAVE10)" maxlength="20">
                            <button id="apply-promo-btn">Apply</button>
                        </div>
                        <div class="promo-message" id="promo-message"></div>
                    </div>
                </div>
                <div class="cart-right">
                    <div class="order-summary-wrapper">
                        <div class="order-summary-sticky" id="order-summary-sticky">
                            <div class="order-summary">
                                <h2>Order Summary</h2>
                                <div class="summary-details">
                                    <div class="summary-row"><span>Subtotal</span><span id="subtotal">$0.00</span></div>
                                    <div class="summary-row"><span>Tax (8%)</span><span id="tax">$0.00</span></div>
                                    <div class="summary-row discount-row" id="discount-row" style="display: none;">
                                        <span>Discount (10%)</span><span id="discount-amount" class="discount-value">-$0.00</span>
                                    </div>
                                </div>
                                <div class="summary-total"><span>Total</span><span id="total">$0.00</span></div>
                                <button class="checkout-btn" id="checkout-btn">Proceed to Checkout</button>
                                <a href="/index.html" class="continue-shopping-btn">Continue Shopping</a>
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
    if (typeof initStickyOrderSummary === 'function') initStickyOrderSummary();
}

function renderCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    if (!cartItemsList) return;
    
    cartItemsList.innerHTML = currentCartItems.map(item => {
        const product = item.product;
        const price = Number(product.price);
        const img = (product.images && product.images.length > 0) ? product.images[0] : 'https://placeholder.com';
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-product">
                    <div class="cart-item-image">
                        <a href="/html/product.html?id=${product.id}"><img src="${img}" alt="${product.title}"></a>
                    </div>
                    <div class="cart-item-info">
                        <a href="/html/product.html?id=${product.id}" class="cart-item-name">${product.title}</a>
                        <span class="cart-item-category">In stock: ${product.stock_quantity}</span>
                    </div>
                </div>
                <div class="cart-item-price">$${price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <div class="quantity-control">
                        <button class="qty-minus" data-id="${item.id}" data-qty="${item.quantity}">−</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="qty-plus" data-id="${item.id}" data-qty="${item.quantity}">+</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <span>$${(price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item-btn" data-id="${item.id}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E7000B" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', () => updateItemQuantity(btn.dataset.id, Number(btn.dataset.qty) - 1));
    });
    document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', () => updateItemQuantity(btn.dataset.id, Number(btn.dataset.qty) + 1));
    });
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', () => removeItem(btn.dataset.id));
    });
}

async function updateItemQuantity(itemId, newQuantity) {
    try {
        const updatedCart = await apiRequest(`/cart/items/${itemId}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity: newQuantity })
        });
        currentCartItems = updatedCart.items || [];
        promoData = null; // Сбрасываем промокод при изменении состава
        currentCartItems.length === 0 ? renderCartPage() : (renderCartItems(), updateSummary());
        updateCartCount();
    } catch (err) {
        alert(err.message);
    }
}

async function removeItem(itemId) {
    try {
        const updatedCart = await apiRequest(`/cart/items/${itemId}`, { method: 'DELETE' });
        currentCartItems = updatedCart.items || [];
        promoData = null;
        currentCartItems.length === 0 ? renderCartPage() : (renderCartItems(), updateSummary());
        updateCartCount();
    } catch (err) {
        alert(err.message);
    }
}

function updateSummary() {
    let subtotal, tax, discount, total;

    if (promoData) {
        subtotal = promoData.subtotal;
        tax = promoData.tax;
        discount = promoData.discount;
        total = promoData.finalPrice;
    } else {
        subtotal = currentCartItems.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
        tax = subtotal * TAX_RATE;
        discount = 0;
        total = subtotal + tax;
    }
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    
    const discountRow = document.getElementById('discount-row');
    if (discount > 0 && discountRow) {
        discountRow.style.display = 'flex';
        document.getElementById('discount-amount').textContent = `-$${discount.toFixed(2)}`;
    } else if (discountRow) {
        discountRow.style.display = 'none';
    }
    
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function initPromoCode() {
    const applyBtn = document.getElementById('apply-promo-btn');
    const promoInput = document.getElementById('promo-input');
    const promoMessage = document.getElementById('promo-message');

    applyBtn?.addEventListener('click', async () => {
        const code = promoInput.value.trim().toUpperCase();
        if (!code) return;

        try {
            promoData = await apiRequest('/cart/apply-promo', {
                method: 'POST',
                body: JSON.stringify({ code })
            });
            promoMessage.textContent = `✓ Promo code ${code} applied!`;
            promoMessage.className = 'promo-message success';
            updateSummary();
        } catch (err) {
            promoMessage.textContent = err.message;
            promoMessage.className = 'promo-message error';
        }
    });
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

document.addEventListener('DOMContentLoaded', () => {
    loadCartPage();
});