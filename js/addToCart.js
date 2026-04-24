let cart = [];

function loadCart() {
    const savedCart = localStorage.getItem('buildmart-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = [];
    }
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('buildmart-cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCountElement = document.querySelector('.cart__count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.visibility = 'visible';
        } else {
            cartCountElement.style.visibility = 'hidden';
        }
    } else {
        console.warn('Элемент .cart__count не найден');
    }
}

function addToCart(productId, productName, productPrice, productImage) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1,
            image: productImage
        });
    }
    
    saveCart();
    updateCartCount();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
        }
    }
}


function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

function getCart() {
    return cart;
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function initCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart');
    
    buttons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = parseInt(newButton.dataset.id);
            const card = newButton.closest('.card');
            const productName = card.querySelector('a:not(:first-child)').textContent;
            const productPrice = parseFloat(card.querySelector('.price').textContent.replace('$', ''));
            const productImage = card.querySelector('img').src;
            
            addToCart(productId, productName, productPrice, productImage);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart(); 
});